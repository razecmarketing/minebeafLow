-- Ensure extensions and types exist
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the app_role type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('root_account', 'admin', 'common_user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Simple direct approach to create admin user
DO $$
DECLARE
    admin_user_id uuid := 'c25a1c26-9e4b-4b8a-a6f1-0a1b2c3d4e5f';
    admin_email text := 'cezicolatecnologia@gmail.com';
BEGIN
    -- Delete existing records if any
    DELETE FROM auth.users WHERE email = admin_email;
    DELETE FROM public.profiles WHERE user_id = admin_user_id;
    
    -- Insert admin user with pre-hashed password (hash for 'minebea640064')
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_sent_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        admin_email,
        crypt('minebea640064', gen_salt('bf')),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"first_name": "Admin", "last_name": "Matriz", "role": "root_account"}',
        now(),
        now()
    );
    
    -- Insert profile
    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        role,
        admin_approved
    ) VALUES (
        admin_user_id,
        'Admin',
        'Matriz',
        'root_account'::app_role,
        true
    );
    
    RAISE NOTICE 'Admin user created with email: %', admin_email;
END
$$;