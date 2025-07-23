import { TaskStatus } from '@/components/dashboard/TaskCard';

export interface MockTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  requester: string;
  dueDate: string;
  createdAt: string;
  slaHours: number;
  category: string;
}

export const mockTasks: MockTask[] = [];

export const mockUser = {
  id: '1',
  name: 'Sistema Limpo',
  role: 'admin' as const,
  tenant: 'Sistema Novo',
  email: 'sistema@limpo.com'
};

export const mockStats = {
  totalTasks: 0,
  pendingApproval: 0,
  completedToday: 0,
  overdueItems: 0,
  activeUsers: 1,
  avgResponseTime: '0h'
};