-- Criar usuário Fábio Morais como admin
DO $$
DECLARE
    fabio_user_id uuid := 'f1234567-1234-1234-1234-123456789abc';
    fabio_email text := 'fabio.morais@minebeamitsumi.eu';
    fabio_password text := 'fabioadmin123';
BEGIN
    -- Deletar usuário existente se houver
    DELETE FROM auth.users WHERE email = fabio_email;
    DELETE FROM public.profiles WHERE user_id = fabio_user_id;
    
    -- Inserir novo usuário Fábio
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
        confirmed_at,
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
        now(),
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