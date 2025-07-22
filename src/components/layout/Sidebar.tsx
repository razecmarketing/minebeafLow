import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  CheckSquare, 
  Clock,
  AlertCircle,
  Archive,
  Shield
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  userRole?: 'admin' | 'user' | 'root';
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = true, 
  userRole = 'user',
  activeSection = 'dashboard',
  onSectionChange
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'user', 'root'] },
    { id: 'requests', label: 'My Requests', icon: FileText, roles: ['admin', 'user', 'root'] },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, roles: ['admin', 'user', 'root'] },
    { id: 'pending', label: 'Pending Approval', icon: Clock, roles: ['admin', 'root'] },
    { id: 'users', label: 'User Management', icon: Users, roles: ['admin', 'root'] },
    { id: 'forms', label: 'Form Builder', icon: FileText, roles: ['admin', 'root'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'root'] },
    { id: 'archive', label: 'Archive', icon: Archive, roles: ['admin', 'root'] },
    { id: 'system', label: 'System Admin', icon: Shield, roles: ['root'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'user', 'root'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  const statusItems = [
    { label: 'Pending', count: 12, color: 'warning' },
    { label: 'In Progress', count: 8, color: 'primary' },
    { label: 'Approved', count: 24, color: 'success' },
    { label: 'Rejected', count: 3, color: 'error' },
  ];

  return (
    <aside className={`bg-card border-r border-border transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    } min-h-screen shadow-sm`}>
      <div className="p-4">
        {/* Logo area - already in header, so we'll use this for user context */}
        {isOpen && (
          <div className="mb-6">
            <div className="bg-accent rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-muted-foreground">Online</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Role: <span className="font-medium text-foreground capitalize">{userRole}</span>
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-10 ${
                  !isOpen ? 'px-3' : 'px-3'
                } ${isActive ? 'shadow-md' : ''}`}
                onClick={() => onSectionChange?.(item.id)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* Quick Status Overview */}
        {isOpen && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Overview
            </h3>
            <div className="space-y-2">
              {statusItems.map((status) => (
                <div key={status.label} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${status.color}`}></div>
                    <span className="text-xs text-muted-foreground">{status.label}</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">{status.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLA Alert */}
        {isOpen && (
          <div className="mt-6 p-3 bg-warning-light border border-warning/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-warning">SLA Alert</p>
                <p className="text-xs text-muted-foreground mt-1">
                  3 requests approaching deadline
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};