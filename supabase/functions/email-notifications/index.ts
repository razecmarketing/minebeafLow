import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  task_id: string;
  notification_type: 'task_created' | 'task_approved' | 'task_rejected' | 'sla_warning';
  recipient_ids: string[];
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

    const { task_id, notification_type, recipient_ids }: EmailRequest = await req.json();

    console.log(`Sending ${notification_type} notification for task ${task_id}`);

    // Get task details with related data
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select(`
        *,
        requester:profiles!tasks_requester_id_fkey(*),
        assignee:profiles!tasks_assignee_id_fkey(*),
        sector:sectors(*)
      `)
      .eq('id', task_id)
      .single();

    if (taskError || !task) {
      throw new Error(`Task not found: ${taskError?.message}`);
    }

    // Get recipient profiles
    const { data: recipients, error: recipientsError } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name')
      .in('user_id', recipient_ids);

    if (recipientsError) {
      throw new Error(`Failed to fetch recipients: ${recipientsError.message}`);
    }

    // Get user emails from auth.users (requires service role)
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, email')
      .in('id', recipient_ids);

    if (authError) {
      console.warn('Could not fetch auth users:', authError.message);
    }

    // Generate email content based on notification type
    const emailContent = generateEmailContent(notification_type, task, recipients || []);

    // Here you would integrate with your email service (Resend, SendGrid, etc.)
    // For now, we'll just log the email content and save notification records

    // Save notification records
    const notifications = (recipients || []).map(recipient => ({
      tenant_id: task.tenant_id,
      user_id: recipient.user_id,
      type: notification_type,
      title: emailContent.subject,
      content: emailContent.body,
      metadata: {
        task_id,
        email_sent: false // Set to true when actually sent
      }
    }));

    const { error: notifError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (notifError) {
      throw new Error(`Failed to save notifications: ${notifError.message}`);
    }

    // Log the notification action
    await supabase
      .from('audit_logs')
      .insert({
        tenant_id: task.tenant_id,
        user_id: 'system',
        action: 'send_notification',
        resource_type: 'task',
        resource_id: task_id,
        metadata: {
          notification_type,
          recipient_count: recipient_ids.length,
          recipients: recipient_ids
        }
      });

    console.log(`Email notifications queued for ${recipient_ids.length} recipients`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notifications sent successfully',
        sent_count: recipient_ids.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Email notification error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Email notification failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function generateEmailContent(type: string, task: any, recipients: any[]) {
  const baseUrl = Deno.env.get('SITE_URL') || 'https://your-app.com';
  
  switch (type) {
    case 'task_created':
      return {
        subject: `Nova Requisição: ${task.title}`,
        body: `
          <h2>Nova Requisição Criada</h2>
          <p><strong>Título:</strong> ${task.title}</p>
          <p><strong>Descrição:</strong> ${task.description}</p>
          <p><strong>Prioridade:</strong> ${task.priority}</p>
          <p><strong>Solicitante:</strong> ${task.requester?.first_name} ${task.requester?.last_name}</p>
          
          <div style="margin: 20px 0;">
            <a href="${baseUrl}/tasks/${task.id}" 
               style="background: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Ver Requisição
            </a>
          </div>
          
          <p><em>Minebea Flow - Sistema de Gestão Empresarial</em></p>
        `
      };

    case 'task_approved':
      return {
        subject: `Requisição Aprovada: ${task.title}`,
        body: `
          <h2>Requisição Aprovada ✅</h2>
          <p>Sua requisição foi aprovada e está sendo processada.</p>
          <p><strong>Título:</strong> ${task.title}</p>
          <p><strong>Status:</strong> Aprovado</p>
          
          <div style="margin: 20px 0;">
            <a href="${baseUrl}/tasks/${task.id}" 
               style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Acompanhar Progresso
            </a>
          </div>
          
          <p><em>Minebea Flow - Sistema de Gestão Empresarial</em></p>
        `
      };

    case 'task_rejected':
      return {
        subject: `Requisição Rejeitada: ${task.title}`,
        body: `
          <h2>Requisição Rejeitada ❌</h2>
          <p>Sua requisição foi rejeitada. Entre em contato com o administrador para mais informações.</p>
          <p><strong>Título:</strong> ${task.title}</p>
          <p><strong>Status:</strong> Rejeitado</p>
          
          <div style="margin: 20px 0;">
            <a href="${baseUrl}/tasks/${task.id}" 
               style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Ver Detalhes
            </a>
          </div>
          
          <p><em>Minebea Flow - Sistema de Gestão Empresarial</em></p>
        `
      };

    case 'sla_warning':
      return {
        subject: `⚠️ SLA Próximo do Vencimento: ${task.title}`,
        body: `
          <h2>SLA Próximo do Vencimento ⚠️</h2>
          <p>A requisição está próxima do vencimento do SLA.</p>
          <p><strong>Título:</strong> ${task.title}</p>
          <p><strong>SLA:</strong> ${task.sla_hours || 24} horas</p>
          <p><strong>Prioridade:</strong> ${task.priority}</p>
          
          <div style="margin: 20px 0;">
            <a href="${baseUrl}/tasks/${task.id}" 
               style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Revisar Urgente
            </a>
          </div>
          
          <p><em>Minebea Flow - Sistema de Gestão Empresarial</em></p>
        `
      };

    default:
      return {
        subject: `Notificação: ${task.title}`,
        body: `
          <h2>Notificação do Sistema</h2>
          <p>Houve uma atualização na requisição: ${task.title}</p>
          
          <div style="margin: 20px 0;">
            <a href="${baseUrl}/tasks/${task.id}" 
               style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Ver Requisição
            </a>
          </div>
          
          <p><em>Minebea Flow - Sistema de Gestão Empresarial</em></p>
        `
      };
  }
}