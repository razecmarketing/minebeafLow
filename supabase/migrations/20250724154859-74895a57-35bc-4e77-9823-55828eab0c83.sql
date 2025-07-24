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