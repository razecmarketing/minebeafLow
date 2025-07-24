-- Update the handle_new_user function to recognize cezicolatecnologia@gmail.com as root
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
      WHEN NEW.email = 'biocodetechnology@gmail.com' THEN 'root_account'::app_role
      WHEN NEW.raw_user_meta_data ->> 'role' = 'admin' THEN 'admin'::app_role
      ELSE 'common_user'::app_role
    END,
    CASE 
      WHEN NEW.email = 'cezicolatecnologia@gmail.com' THEN true
      WHEN NEW.email = 'biocodetechnology@gmail.com' THEN true
      WHEN NEW.raw_user_meta_data ->> 'role' = 'admin' THEN false
      ELSE true
    END
  );
  RETURN NEW;
END;
$$;

-- Create or update the user with the specified email and password
CREATE OR REPLACE FUNCTION public.create_root_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if the user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'cezicolatecnologia@gmail.com') THEN
    -- Insert the user into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      last_sign_in_at,
      email_change_token_current,
      email_change_confirm_status,
      banned_until,
      reauthentication_token,
      reauthentication_sent_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'cezicolatecnologia@gmail.com',
      crypt('cnz640064', gen_salt('bf')),
      NOW(),
      NOW(),
      '',
      '',
      '',
      '',
      '{"provider": "email", "providers": ["email"]}',
      '{"first_name": "Admin", "last_name": "Root"}',
      false,
      NOW(),
      NOW(),
      NOW(),
      '',
      0,
      NULL,
      '',
      NULL
    );
  ELSE
    -- Update existing user password
    UPDATE auth.users 
    SET encrypted_password = crypt('cnz640064', gen_salt('bf')),
        updated_at = NOW()
    WHERE email = 'cezicolatecnologia@gmail.com';
  END IF;
END;
$$;

-- Execute the function to create/update the root user
SELECT public.create_root_user();