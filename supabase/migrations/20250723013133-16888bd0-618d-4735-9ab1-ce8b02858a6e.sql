-- Create app_role enum if not exists
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('root_account', 'admin', 'common_user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create task_status enum
CREATE TYPE task_status AS ENUM ('pending', 'approved', 'production', 'completed', 'rejected');

-- Create task_priority enum  
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sectors table
CREATE TABLE public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create custom_forms table
CREATE TABLE public.custom_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  fields JSONB NOT NULL DEFAULT '[]',
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'pending',
  priority task_priority DEFAULT 'medium',
  assignee_id UUID REFERENCES public.profiles(user_id),
  requester_id UUID NOT NULL REFERENCES public.profiles(user_id),
  sector_id UUID REFERENCES public.sectors(id),
  custom_form_id UUID REFERENCES public.custom_forms(id),
  due_date TIMESTAMP WITH TIME ZONE,
  sla_hours INTEGER,
  category TEXT,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create task_history table for audit trail
CREATE TABLE public.task_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenants
CREATE POLICY "Root accounts can view all tenants" ON public.tenants
FOR SELECT USING (public.has_role(auth.uid(), 'root_account'));

CREATE POLICY "Root accounts can manage tenants" ON public.tenants
FOR ALL USING (public.has_role(auth.uid(), 'root_account'));

-- Create RLS policies for sectors
CREATE POLICY "Users can view sectors in their tenant" ON public.sectors
FOR SELECT USING (
  tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage sectors in their tenant" ON public.sectors
FOR ALL USING (
  tenant_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'admin' OR role = 'root_account')
  )
);

-- Create RLS policies for custom_forms
CREATE POLICY "Users can view forms in their tenant" ON public.custom_forms
FOR SELECT USING (
  tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage forms in their tenant" ON public.custom_forms
FOR ALL USING (
  tenant_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'admin' OR role = 'root_account')
  )
);

-- Create RLS policies for tasks
CREATE POLICY "Users can view tasks in their tenant" ON public.tasks
FOR SELECT USING (
  tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create tasks" ON public.tasks
FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
  )
  AND requester_id = auth.uid()
);

CREATE POLICY "Admins can manage tasks in their tenant" ON public.tasks
FOR UPDATE USING (
  tenant_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'admin' OR role = 'root_account')
  )
);

CREATE POLICY "Admins can delete tasks in their tenant" ON public.tasks
FOR DELETE USING (
  tenant_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND (role = 'admin' OR role = 'root_account')
  )
);

-- Create RLS policies for task_history
CREATE POLICY "Users can view task history in their tenant" ON public.task_history
FOR SELECT USING (
  task_id IN (
    SELECT id FROM public.tasks 
    WHERE tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can create task history" ON public.task_history
FOR INSERT WITH CHECK (
  user_id = auth.uid()
  AND task_id IN (
    SELECT id FROM public.tasks 
    WHERE tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

-- Create triggers for updated_at columns
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sectors_updated_at
  BEFORE UPDATE ON public.sectors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_forms_updated_at
  BEFORE UPDATE ON public.custom_forms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_tasks_tenant_id ON public.tasks(tenant_id);
CREATE INDEX idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_requester_id ON public.tasks(requester_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at);

CREATE INDEX idx_sectors_tenant_id ON public.sectors(tenant_id);
CREATE INDEX idx_custom_forms_tenant_id ON public.custom_forms(tenant_id);
CREATE INDEX idx_task_history_task_id ON public.task_history(task_id);

-- Insert default tenant for existing users
INSERT INTO public.tenants (id, name, domain, is_active)
VALUES (gen_random_uuid(), 'Default Organization', 'default.local', true)
ON CONFLICT DO NOTHING;