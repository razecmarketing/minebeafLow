-- Criar usuário matriz admin
-- Primeiro, vamos inserir um perfil para o usuário root
INSERT INTO public.profiles (
  id, 
  first_name, 
  last_name, 
  role, 
  admin_approved, 
  tenant_id
) VALUES (
  'c25a1c26-9e4b-4b8a-a6f1-0a1b2c3d4e5f',
  'Admin',
  'Matriz',
  'root_account',
  true,
  'MATRIZ'
) ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  admin_approved = EXCLUDED.admin_approved,
  tenant_id = EXCLUDED.tenant_id;