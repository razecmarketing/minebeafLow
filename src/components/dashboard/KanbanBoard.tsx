import React from 'react';
import { TaskCard, TaskStatus } from './TaskCard';
import { Plus, Filter, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Task {
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
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskView?: (taskId: string) => void;
  onCreateTask?: () => void;
  userRole?: 'admin' | 'user' | 'root';
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskStatusChange,
  onTaskView,
  onCreateTask,
  userRole = 'user'
}) => {
  const columns = [
    { 
      id: 'pending' as TaskStatus, 
      title: 'Pending Approval', 
      color: 'border-warning bg-warning-light',
      count: tasks.filter(t => t.status === 'pending').length
    },
    { 
      id: 'approved' as TaskStatus, 
      title: 'Approved', 
      color: 'border-success bg-success-light',
      count: tasks.filter(t => t.status === 'approved').length
    },
    { 
      id: 'production' as TaskStatus, 
      title: 'In Production', 
      color: 'border-primary bg-primary/10',
      count: tasks.filter(t => t.status === 'production').length
    },
    { 
      id: 'completed' as TaskStatus, 
      title: 'Completed', 
      color: 'border-success bg-success-light',
      count: tasks.filter(t => t.status === 'completed').length
    },
    { 
      id: 'rejected' as TaskStatus, 
      title: 'Rejected', 
      color: 'border-error bg-error-light',
      count: tasks.filter(t => t.status === 'rejected').length
    }
  ];

  const getTasksForColumn = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Board</h2>
          <p className="text-muted-foreground">Manage and track all requests and tasks</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="enterprise" 
            size="sm"
            onClick={onCreateTask}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 overflow-auto">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col min-h-0">
            {/* Column Header */}
            <div className={`p-3 rounded-t-lg border-t-2 ${column.color} border border-b-0`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
                  {column.count}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 bg-muted/30 border border-t-0 rounded-b-lg p-3 space-y-3 min-h-[400px] overflow-y-auto">
              {getTasksForColumn(column.id).length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 w-full">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">Nenhuma tarefa</p>
                    <p className="text-xs text-muted-foreground mt-1">Aguardando primeira requisição</p>
                  </div>
                </div>
              ) : (
                getTasksForColumn(column.id).map((task) => (
                  <TaskCard
                    key={task.id}
                    {...task}
                    onStatusChange={userRole === 'admin' || userRole === 'root' ? onTaskStatusChange : undefined}
                    onViewDetails={onTaskView}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};