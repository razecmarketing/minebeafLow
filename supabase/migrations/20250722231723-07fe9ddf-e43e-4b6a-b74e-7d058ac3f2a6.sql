-- First ensure the extensions are available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Simple direct approach to create admin user
DO $$
DECLARE
    admin_user_id uuid := 'c25a1c26-9e4b-4b8a-a6f1-0a1b2c3d4e5f';
    admin_email text := 'cezicolatecnologia@gmail.com';
BEGIN
    -- Delete existing records if any
    DELETE FROM auth.users WHERE email = admin_email;
    DELETE FROM public.profiles WHERE user_id = admin_user_id;
    
    -- Insert admin user with pre-hashed password
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
        '$2a$10$X8K8qBJxhVwxX8K8qBJxhOeL4K8qBJxhVwxX8K8qBJxhVwxX8K8qB',
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