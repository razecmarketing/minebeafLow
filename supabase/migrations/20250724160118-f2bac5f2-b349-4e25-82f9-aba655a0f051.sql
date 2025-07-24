-- Create the app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('root_account', 'admin', 'common_user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create the task_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create the task_priority enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the handle_new_user function to only recognize cezicolatecnologia@gmail.com as root
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
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
    CASE 
      WHEN NEW.email = 'cezicolatecnologia@gmail.com' THEN 'root_account'::app_role
      WHEN NEW.raw_user_meta_data ->> 'role' = 'admin' THEN 'admin'::app_role
      ELSE 'common_user'::app_role
    END,
    CASE 
      WHEN NEW.email = 'cezicolatecnologia@gmail.com' THEN true
      WHEN NEW.raw_user_meta_data ->> 'role' = 'admin' THEN false
      ELSE true
    END
  );
  RETURN NEW;
END;
$$;

-- Create or update the set_admin_password function for the root user
CREATE OR REPLACE FUNCTION public.set_admin_password()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if the admin user exists in auth.users
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'cezicolatecnologia@gmail.com') THEN
    -- Update the password
    UPDATE auth.users 
    SET encrypted_password = crypt('cnz640064', gen_salt('bf')),
        updated_at = now()
    WHERE email = 'cezicolatecnologia@gmail.com';
  END IF;
END;
$$;