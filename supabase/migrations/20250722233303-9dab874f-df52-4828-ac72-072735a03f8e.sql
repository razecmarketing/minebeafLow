-- Fix confirmation token issues for admin user
UPDATE auth.users 
SET confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    phone_change_token = ''
WHERE email = 'biocodetechnology@gmail.com' AND id = 'c25a1c26-9e4b-4b8a-a6f1-0a1b2c3d4e5f';