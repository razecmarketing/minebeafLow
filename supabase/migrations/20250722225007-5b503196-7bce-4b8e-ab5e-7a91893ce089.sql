-- Insert admin user with specific credentials
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  'c25a1c26-9e4b-4b8a-a6f1-0a1b2c3d4e5f',
  '00000000-0000-0000-0000-000000000000',
  'cezicolatecnologia@gmail.com',
  crypt('minebea640064', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('minebea640064', gen_salt('bf')),
  updated_at = now();

-- Update the trigger function to handle admin approval properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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