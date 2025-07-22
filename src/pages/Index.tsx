import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { mockTasks, mockUser, mockStats } from '@/data/mockData';
import { TaskStatus } from '@/components/dashboard/TaskCard';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [tasks, setTasks] = useState(mockTasks);

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus}`,
      variant: "default",
    });
  };

  const handleTaskView = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    toast({
      title: "Task Details",
      description: `Viewing details for: ${task?.title}`,
      variant: "default",
    });
  };

  const handleCreateTask = () => {
    toast({
      title: "Create New Task",
      description: "Opening task creation form...",
      variant: "default",
    });
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        user={mockUser}
        onMenuToggle={handleMenuToggle}
      />
      
      <div className="flex flex-1">
        <Sidebar 
          isOpen={sidebarOpen}
          userRole={mockUser.role}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {mockUser.name}
                </h1>
                <p className="text-muted-foreground">
                  Here's what's happening with your tasks and requests today.
                </p>
              </div>
              
              <StatsOverview stats={mockStats} />
              
              <KanbanBoard
                tasks={tasks}
                onTaskStatusChange={handleTaskStatusChange}
                onTaskView={handleTaskView}
                onCreateTask={handleCreateTask}
                userRole={mockUser.role}
              />
            </div>
          )}
          
          {activeSection !== 'dashboard' && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Module
                </h2>
                <p className="text-muted-foreground">
                  This module is under development and will be available soon.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
