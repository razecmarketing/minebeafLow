import React from 'react';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Users, FileText } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, color }) => (
  <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-elevated transition-all duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        {change && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${
            changeType === 'positive' ? 'text-success' : 
            changeType === 'negative' ? 'text-error' : 'text-muted-foreground'
          }`}>
            <TrendingUp className={`h-4 w-4 ${changeType === 'negative' ? 'rotate-180' : ''}`} />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

interface StatsOverviewProps {
  stats?: {
    totalTasks: number;
    pendingApproval: number;
    completedToday: number;
    overdueItems: number;
    activeUsers: number;
    avgResponseTime: string;
  };
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const defaultStats = {
    totalTasks: 156,
    pendingApproval: 23,
    completedToday: 12,
    overdueItems: 5,
    activeUsers: 42,
    avgResponseTime: '2.4h',
    ...stats
  };

  const statCards = [
    {
      title: 'Total Active Tasks',
      value: defaultStats.totalTasks,
      change: '+12% from last week',
      changeType: 'positive' as const,
      icon: <FileText className="h-6 w-6 text-primary-foreground" />,
      color: 'bg-gradient-primary'
    },
    {
      title: 'Pending Approval',
      value: defaultStats.pendingApproval,
      change: '+5 since yesterday',
      changeType: 'neutral' as const,
      icon: <Clock className="h-6 w-6 text-warning-foreground" />,
      color: 'bg-warning'
    },
    {
      title: 'Completed Today',
      value: defaultStats.completedToday,
      change: '+8% from yesterday',
      changeType: 'positive' as const,
      icon: <CheckCircle className="h-6 w-6 text-success-foreground" />,
      color: 'bg-success'
    },
    {
      title: 'Overdue Items',
      value: defaultStats.overdueItems,
      change: '-2 from yesterday',
      changeType: 'positive' as const,
      icon: <AlertTriangle className="h-6 w-6 text-error-foreground" />,
      color: 'bg-error'
    },
    {
      title: 'Active Users',
      value: defaultStats.activeUsers,
      change: '+3 online now',
      changeType: 'positive' as const,
      icon: <Users className="h-6 w-6 text-primary-foreground" />,
      color: 'bg-primary'
    },
    {
      title: 'Avg Response Time',
      value: defaultStats.avgResponseTime,
      change: '-15% faster',
      changeType: 'positive' as const,
      icon: <TrendingUp className="h-6 w-6 text-success-foreground" />,
      color: 'bg-success'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};