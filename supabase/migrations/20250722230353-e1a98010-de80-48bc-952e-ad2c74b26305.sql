-- Create a function to set the admin password
CREATE OR REPLACE FUNCTION set_admin_password()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the admin user exists in auth.users
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'cezicolatecnologia@gmail.com') THEN
    -- Update the password
    UPDATE auth.users 
    SET encrypted_password = crypt('minebea640064', gen_salt('bf')),
        updated_at = now()
    WHERE email = 'cezicolatecnologia@gmail.com';
  END IF;
END;
$$;

-- Execute the function
SELECT set_admin_password();