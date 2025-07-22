import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, AlertCircle, CheckCircle, XCircle, PlayCircle } from 'lucide-react';

export type TaskStatus = 'pending' | 'approved' | 'production' | 'rejected' | 'completed';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  requester: string;
  dueDate: string;
  createdAt: string;
  slaHours?: number;
  category?: string;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onViewDetails?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  status,
  priority,
  assignee,
  requester,
  dueDate,
  createdAt,
  slaHours = 24,
  category = 'General',
  onStatusChange,
  onViewDetails
}) => {
  const statusConfig = {
    pending: { 
      color: 'warning', 
      icon: Clock, 
      label: 'Pending',
      bgClass: 'bg-warning-light border-warning/20 text-warning'
    },
    approved: { 
      color: 'success', 
      icon: CheckCircle, 
      label: 'Approved',
      bgClass: 'bg-success-light border-success/20 text-success'
    },
    production: { 
      color: 'primary', 
      icon: PlayCircle, 
      label: 'In Production',
      bgClass: 'bg-primary/10 border-primary/20 text-primary'
    },
    rejected: { 
      color: 'error', 
      icon: XCircle, 
      label: 'Rejected',
      bgClass: 'bg-error-light border-error/20 text-error'
    },
    completed: { 
      color: 'success', 
      icon: CheckCircle, 
      label: 'Completed',
      bgClass: 'bg-success-light border-success/20 text-success'
    }
  };

  const priorityConfig = {
    low: { color: 'text-muted-foreground', bg: 'bg-muted' },
    medium: { color: 'text-warning', bg: 'bg-warning-light' },
    high: { color: 'text-error', bg: 'bg-error-light' },
    urgent: { color: 'text-error font-bold', bg: 'bg-error animate-pulse' }
  };

  const StatusIcon = statusConfig[status].icon;
  
  const timeRemaining = () => {
    const created = new Date(createdAt);
    const deadline = new Date(created.getTime() + slaHours * 60 * 60 * 1000);
    const now = new Date();
    const remaining = deadline.getTime() - now.getTime();
    
    if (remaining <= 0) return 'Overdue';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const isOverdue = timeRemaining() === 'Overdue';

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-card hover:shadow-elevated transition-all duration-200 hover:scale-[1.01]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[priority].bg} ${priorityConfig[priority].color}`}>
              {priority.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[status].bgClass} flex items-center gap-1`}>
          <StatusIcon className="h-3 w-3" />
          {statusConfig[status].label}
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{requester}</span>
          </div>
          {assignee && (
            <div className="flex items-center gap-1">
              <span>→</span>
              <span className="font-medium">{assignee}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{category}</span>
          </div>
          
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-error' : 'text-muted-foreground'}`}>
            <Clock className="h-3 w-3" />
            <span className={isOverdue ? 'font-medium' : ''}>{timeRemaining()}</span>
            {isOverdue && <AlertCircle className="h-3 w-3" />}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails?.(id)}
        >
          View Details
        </Button>
        
        <div className="flex gap-2">
          {status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="xs"
                onClick={() => onStatusChange?.(id, 'rejected')}
              >
                Reject
              </Button>
              <Button
                variant="success"
                size="xs"
                onClick={() => onStatusChange?.(id, 'approved')}
              >
                Approve
              </Button>
            </>
          )}
          
          {status === 'approved' && (
            <Button
              variant="default"
              size="xs"
              onClick={() => onStatusChange?.(id, 'production')}
            >
              Start Production
            </Button>
          )}
          
          {status === 'production' && (
            <Button
              variant="success"
              size="xs"
              onClick={() => onStatusChange?.(id, 'completed')}
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};