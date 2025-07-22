-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to create admin user safely
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    user_id uuid := 'c25a1c26-9e4b-4b8a-a6f1-0a1b2c3d4e5f';
    admin_email text := 'cezicolatecnologia@gmail.com';
    admin_password text := 'minebea640064';
BEGIN
    -- First, delete any existing user with this email to avoid conflicts
    DELETE FROM auth.users WHERE email = admin_email;
    DELETE FROM public.profiles WHERE user_id = user_id;
    
    -- Insert the admin user into auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        confirmed_at,
        recovery_sent_at,
        email_change_sent_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        now(),
        now(),
        now(),
        null,
        null,
        '{"provider": "email", "providers": ["email"]}',
        '{"first_name": "Admin", "last_name": "Matriz", "role": "root_account"}',
        false,
        now(),
        now(),
        null,
        null,
        '',
        '',
        null,
        '',
        '',
        '',
        ''
    );
    
    -- Insert the corresponding profile
    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        role,
        admin_approved,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        'Admin',
        'Matriz',
        'root_account'::app_role,
        true,
        now(),
        now()
    );
    
    RAISE NOTICE 'Admin user created successfully with email: %', admin_email;
END;
$$;

-- Execute the function to create the admin user
SELECT create_admin_user();