-- Criar usuário Fábio Morais como admin (versão corrigida)
DO $$
DECLARE
    fabio_user_id uuid := 'f1234567-1234-1234-1234-123456789abc';
    fabio_email text := 'fabio.morais@minebeamitsumi.eu';
    fabio_password text := 'fabioadmin123';
BEGIN
    -- Deletar usuário existente se houver
    DELETE FROM auth.users WHERE email = fabio_email;
    DELETE FROM public.profiles WHERE user_id = fabio_user_id;
    
    -- Inserir novo usuário Fábio (sem confirmed_at que é coluna gerada)
    INSERT INTO auth.users (
        id,
        aud,
        role,
        email,
        email_confirmed_at,
        phone_confirmed_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        instance_id,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        last_sign_in_at,
        email_change_sent_at,
        banned_until,
        phone_change_token,
        phone_change,
        phone_change_sent_at,
        email_change_confirm_status,
        encrypted_password
    ) VALUES (
        fabio_user_id,
        'authenticated',
        'authenticated', 
        fabio_email,
        now(),
        null,
        '',
        '',
        '',
        '',
        '00000000-0000-0000-0000-000000000000',
        '{"provider": "email", "providers": ["email"]}',
        '{"first_name": "Fábio", "last_name": "Morais", "role": "admin"}',
        false,
        now(),
        now(),
        null,
        null,
        null,
        '',
        '',
        null,
        0,
        crypt(fabio_password, gen_salt('bf'))
    );
    
    -- Inserir perfil para Fábio
    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        role,
        admin_approved
    ) VALUES (
        fabio_user_id,
        'Fábio',
        'Morais',
        'admin'::app_role,
        false  -- Admin precisa ser aprovado
    );
    
    RAISE NOTICE 'Usuário Fábio Morais criado com sucesso - Email: %', fabio_email;
END
$$;

-- Verificar se o usuário admin principal existe e atualizar se necessário
DO $$
DECLARE
    admin_user_id uuid := 'c25a1c26-9e4b-4b8a-a6f1-0a1b2c3d4e5f';
    admin_email text := 'biocodetechnology@gmail.com';
    admin_password text := 'minebea640064';
BEGIN
    -- Verificar se o usuário admin existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email AND id = admin_user_id) THEN
        -- Se não existe, criar
        INSERT INTO auth.users (
            id,
            aud,
            role,
            email,
            email_confirmed_at,
            phone_confirmed_at,
            confirmation_token,
            recovery_token,
            email_change_token_new,
            email_change,
            instance_id,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            created_at,
            updated_at,
            last_sign_in_at,
            email_change_sent_at,
            banned_until,
            phone_change_token,
            phone_change,
            phone_change_sent_at,
            email_change_confirm_status,
            encrypted_password
        ) VALUES (
            admin_user_id,
            'authenticated',
            'authenticated', 
            admin_email,
            now(),
            null,
            '',
            '',
            '',
            '',
            '00000000-0000-0000-0000-000000000000',
            '{"provider": "email", "providers": ["email"]}',
            '{"first_name": "Cezi", "last_name": "Cola", "role": "root_account"}',
            false,
            now(),
            now(),
            null,
            null,
            null,
            '',
            '',
            null,
            0,
            crypt(admin_password, gen_salt('bf'))
        );
    ELSE
        -- Se existe, apenas atualizar a senha
        UPDATE auth.users 
        SET encrypted_password = crypt(admin_password, gen_salt('bf')),
            updated_at = now(),
            email_confirmed_at = now()
        WHERE email = admin_email AND id = admin_user_id;
    END IF;
    
    -- Verificar se o perfil existe
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = admin_user_id) THEN
        INSERT INTO public.profiles (
            user_id,
            first_name,
            last_name,
            role,
            admin_approved
        ) VALUES (
            admin_user_id,
            'Cezi',
            'Cola',
            'root_account'::app_role,
            true
        );
    END IF;
    
    RAISE NOTICE 'Usuário admin principal verificado/atualizado - Email: %', admin_email;
END
$$;