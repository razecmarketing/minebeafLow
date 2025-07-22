-- Update admin user email and profile information
DO $$
DECLARE
    admin_user_id uuid := 'c25a1c26-9e4b-4b8a-a6f1-0a1b2c3d4e5f';
    old_email text := 'cezicolatecnologia@gmail.com';
    new_email text := 'biocodetechnology@gmail.com';
BEGIN
    -- Update email in auth.users
    UPDATE auth.users 
    SET email = new_email,
        raw_user_meta_data = '{"first_name": "Cezi", "last_name": "Cola", "role": "root_account"}',
        updated_at = now()
    WHERE id = admin_user_id AND email = old_email;
    
    -- Update profile information
    UPDATE public.profiles 
    SET first_name = 'Cezi',
        last_name = 'Cola',
        updated_at = now()
    WHERE user_id = admin_user_id;
    
    -- Update the trigger function to use new email
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER SET search_path = ''
    AS $function$
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
          WHEN NEW.email = 'biocodetechnology@gmail.com' THEN 'root_account'::app_role
          WHEN NEW.raw_user_meta_data ->> 'role' = 'admin' THEN 'admin'::app_role
          ELSE 'common_user'::app_role
        END,
        CASE 
          WHEN NEW.email = 'biocodetechnology@gmail.com' THEN true
          WHEN NEW.raw_user_meta_data ->> 'role' = 'admin' THEN false
          ELSE true
        END
      );

      RETURN NEW;
    END;
    $function$;
    
    RAISE NOTICE 'Admin user updated - Email: %, Name: Cezi Cola', new_email;
END
$$;