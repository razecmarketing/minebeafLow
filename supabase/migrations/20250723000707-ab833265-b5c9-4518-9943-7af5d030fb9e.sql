-- Fix NULL values in auth.users that are causing login issues
UPDATE auth.users 
SET 
    email_change = '',
    email_change_token_new = '',
    email_change_token_current = '',
    email_change_confirm_status = 0,
    phone_change = '',
    phone_change_token = '',
    recovery_token = '',
    confirmation_token = ''
WHERE email = 'biocodetechnology@gmail.com' 
  AND (
    email_change IS NULL OR 
    email_change_token_new IS NULL OR 
    email_change_token_current IS NULL OR 
    phone_change IS NULL OR 
    phone_change_token IS NULL OR 
    recovery_token IS NULL OR 
    confirmation_token IS NULL
  );