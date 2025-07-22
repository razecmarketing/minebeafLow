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

export const mockTasks: MockTask[] = [
  {
    id: '1',
    title: 'Server Infrastructure Upgrade',
    description: 'Upgrade production servers to handle increased load and improve performance metrics.',
    status: 'pending',
    priority: 'high',
    requester: 'João Silva',
    assignee: 'Ana Costa',
    dueDate: '2025-01-25',
    createdAt: '2025-01-22T08:00:00Z',
    slaHours: 48,
    category: 'Infrastructure'
  },
  {
    id: '2',
    title: 'New Employee Onboarding',
    description: 'Setup workspace, accounts, and training schedule for new marketing team member.',
    status: 'approved',
    priority: 'medium',
    requester: 'Maria Santos',
    assignee: 'Carlos Lima',
    dueDate: '2025-01-24',
    createdAt: '2025-01-20T10:30:00Z',
    slaHours: 24,
    category: 'HR'
  },
  {
    id: '3',
    title: 'Security Audit Report',
    description: 'Comprehensive security audit of all systems and applications.',
    status: 'production',
    priority: 'urgent',
    requester: 'Pedro Oliveira',
    assignee: 'Lucia Ferreira',
    dueDate: '2025-01-23',
    createdAt: '2025-01-18T14:15:00Z',
    slaHours: 72,
    category: 'Security'
  },
  {
    id: '4',
    title: 'Budget Approval Q1',
    description: 'Review and approve first quarter budget allocation for all departments.',
    status: 'completed',
    priority: 'high',
    requester: 'Fernando Costa',
    assignee: 'Roberto Silva',
    dueDate: '2025-01-20',
    createdAt: '2025-01-15T09:00:00Z',
    slaHours: 48,
    category: 'Finance'
  },
  {
    id: '5',
    title: 'Website Redesign Proposal',
    description: 'Proposal for complete website redesign including UX improvements and modern design.',
    status: 'rejected',
    priority: 'low',
    requester: 'Sandra Alves',
    dueDate: '2025-01-30',
    createdAt: '2025-01-19T16:45:00Z',
    slaHours: 96,
    category: 'Marketing'
  },
  {
    id: '6',
    title: 'Database Optimization',
    description: 'Optimize database queries and improve response times for customer portal.',
    status: 'pending',
    priority: 'medium',
    requester: 'Rafael Torres',
    assignee: 'Beatriz Nunes',
    dueDate: '2025-01-26',
    createdAt: '2025-01-21T11:20:00Z',
    slaHours: 48,
    category: 'Development'
  },
  {
    id: '7',
    title: 'Equipment Purchase',
    description: 'Purchase new laptops and monitors for development team expansion.',
    status: 'approved',
    priority: 'medium',
    requester: 'Marcos Reis',
    assignee: 'Claudia Martins',
    dueDate: '2025-01-28',
    createdAt: '2025-01-21T13:10:00Z',
    slaHours: 72,
    category: 'Procurement'
  },
  {
    id: '8',
    title: 'API Rate Limiting',
    description: 'Implement rate limiting for external API calls to prevent abuse.',
    status: 'production',
    priority: 'high',
    requester: 'Gabriel Sousa',
    assignee: 'Patricia Rocha',
    dueDate: '2025-01-24',
    createdAt: '2025-01-20T15:30:00Z',
    slaHours: 36,
    category: 'Development'
  }
];

export const mockUser = {
  id: '1',
  name: 'Admin User',
  role: 'admin' as const,
  tenant: 'Acme Corp',
  email: 'admin@acme.com'
};

export const mockStats = {
  totalTasks: mockTasks.length,
  pendingApproval: mockTasks.filter(t => t.status === 'pending').length,
  completedToday: mockTasks.filter(t => t.status === 'completed' && 
    new Date(t.createdAt).toDateString() === new Date().toDateString()).length,
  overdueItems: mockTasks.filter(t => {
    const created = new Date(t.createdAt);
    const deadline = new Date(created.getTime() + t.slaHours * 60 * 60 * 1000);
    return deadline < new Date() && t.status !== 'completed';
  }).length,
  activeUsers: 42,
  avgResponseTime: '2.4h'
};