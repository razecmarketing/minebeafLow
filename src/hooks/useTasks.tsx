import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'production' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  requester: string;
  dueDate: string;
  createdAt: string;
  slaHours?: number;
  category?: string;
  tenant_id: string;
  assignee_id?: string;
  requester_id: string;
  sector_id?: string;
  custom_form_id?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  assignee_name?: string;
  requester_name?: string;
  sector_name?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.tenant_id) {
      fetchTasks();
    }
  }, [profile?.tenant_id]);

  const fetchTasks = async () => {
    if (!profile?.tenant_id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!assignee_id(first_name, last_name),
          requester:profiles!requester_id(first_name, last_name),
          sector:sectors(name)
        `)
        .eq('tenant_id', profile.tenant_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks = data?.map(task => ({
        ...task,
        assignee: task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : undefined,
        requester: task.requester ? `${task.requester.first_name} ${task.requester.last_name}` : '',
        dueDate: task.due_date || task.created_at,
        createdAt: task.created_at,
        slaHours: task.sla_hours,
        assignee_name: task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : undefined,
        requester_name: task.requester ? `${task.requester.first_name} ${task.requester.last_name}` : undefined,
        sector_name: task.sector?.name
      })) || [];

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: { title: string; description?: string; priority?: Task['priority']; category?: string }) => {
    if (!profile?.tenant_id) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority || 'medium',
          category: taskData.category,
          requester_id: profile.user_id,
          tenant_id: profile.tenant_id,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchTasks();
      toast({
        title: "Success",
        description: "Task created successfully",
        variant: "default",
      });

      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .eq('tenant_id', profile?.tenant_id);

      if (error) throw error;

      await fetchTasks();
      toast({
        title: "Success",
        description: `Task status updated to ${newStatus}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTaskStatus
  };
};