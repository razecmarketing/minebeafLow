-- Criar usuário matriz admin
-- Inserir um perfil para o usuário root com UUID gerado automaticamente para tenant_id
INSERT INTO public.profiles (
  user_id, 
  first_name, 
  last_name, 
  role, 
  admin_approved
) VALUES (
  'c25a1c26-9e4b-4b8a-a6f1-0a1b2c3d4e5f',
  'Admin',
  'Matriz',
  'root_account',
  true
) ON CONFLICT (user_id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  admin_approved = EXCLUDED.admin_approved;