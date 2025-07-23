import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowRule {
  condition: string;
  action: string;
  parameters: Record<string, any>;
}

interface AutoApprovalRule {
  sector_id?: string;
  priority?: string;
  category?: string;
  max_amount?: number;
  auto_approve: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { task_id, event_type } = await req.json();

    console.log(`Processing workflow event: ${event_type} for task ${task_id}`);

    // Get task details
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select(`
        *,
        sector:sectors(*),
        requester:profiles!tasks_requester_id_fkey(*)
      `)
      .eq('id', task_id)
      .single();

    if (taskError || !task) {
      throw new Error(`Task not found: ${taskError?.message}`);
    }

    // Get workflow rules for the tenant
    const { data: rules, error: rulesError } = await supabase
      .from('approval_workflows')
      .select('*')
      .eq('tenant_id', task.tenant_id)
      .eq('is_active', true);

    if (rulesError) {
      throw new Error(`Failed to fetch workflow rules: ${rulesError.message}`);
    }

    // Check for auto-approval conditions
    if (event_type === 'task_created' && task.status === 'pending') {
      const autoApprovalRule = rules?.find((rule: any) => 
        checkAutoApprovalCondition(rule.conditions, task)
      );

      if (autoApprovalRule) {
        // Auto-approve the task
        const { error: updateError } = await supabase
          .from('tasks')
          .update({ 
            status: 'approved',
            updated_at: new Date().toISOString()
          })
          .eq('id', task_id);

        if (updateError) {
          throw new Error(`Failed to auto-approve task: ${updateError.message}`);
        }

        // Log the auto-approval
        await supabase
          .from('audit_logs')
          .insert({
            tenant_id: task.tenant_id,
            user_id: 'system',
            action: 'auto_approve_task',
            resource_type: 'task',
            resource_id: task_id,
            metadata: {
              rule_id: autoApprovalRule.id,
              original_status: 'pending',
              new_status: 'approved'
            }
          });

        console.log(`Task ${task_id} auto-approved by rule ${autoApprovalRule.id}`);
      }
    }

    // Handle SLA escalation
    if (event_type === 'sla_check') {
      const slaDeadline = new Date(task.created_at);
      slaDeadline.setHours(slaDeadline.getHours() + (task.sla_hours || 24));
      
      if (new Date() > slaDeadline && task.status === 'pending') {
        // Escalate to tenant admins
        const { data: admins } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .eq('tenant_id', task.tenant_id)
          .eq('role', 'admin')
          .eq('admin_approved', true);

        // Log SLA breach
        await supabase
          .from('audit_logs')
          .insert({
            tenant_id: task.tenant_id,
            user_id: 'system',
            action: 'sla_breach',
            resource_type: 'task',
            resource_id: task_id,
            metadata: {
              sla_hours: task.sla_hours || 24,
              escalated_to: admins?.map(a => a.user_id)
            }
          });

        console.log(`SLA breach detected for task ${task_id}, escalated to admins`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Workflow processed successfully',
        task_id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Workflow engine error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Workflow processing failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function checkAutoApprovalCondition(conditions: any, task: any): boolean {
  if (!conditions) return false;

  // Check if conditions match
  if (conditions.priority && conditions.priority !== task.priority) {
    return false;
  }

  if (conditions.category && conditions.category !== task.category) {
    return false;
  }

  if (conditions.sector_id && conditions.sector_id !== task.sector_id) {
    return false;
  }

  if (conditions.max_amount && task.estimated_cost > conditions.max_amount) {
    return false;
  }

  return conditions.auto_approve === true;
}