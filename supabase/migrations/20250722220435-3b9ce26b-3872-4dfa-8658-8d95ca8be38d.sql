-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('root_account', 'admin', 'common_user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role app_role DEFAULT 'common_user',
  admin_approved BOOLEAN DEFAULT false,
  tenant_id UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
      AND (role != 'admin' OR admin_approved = true)
  )
$$;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles in their tenant"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'root_account')
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_role app_role := 'common_user';
  needs_approval BOOLEAN := false;
BEGIN
  -- Check if user email indicates admin role
  IF NEW.email = 'cezicolatecnologia@gmail.com' THEN
    user_role := 'root_account';
  ELSIF NEW.raw_user_meta_data ->> 'role' = 'admin' THEN
    user_role := 'admin';
    needs_approval := true;
  END IF;

  INSERT INTO public.profiles (
    user_id,
    first_name,
    last_name,
    role,
    admin_approved
  ) VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    user_role,
    NOT needs_approval
  );

  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();