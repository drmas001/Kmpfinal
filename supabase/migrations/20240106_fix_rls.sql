-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON employees;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON employees;
DROP POLICY IF EXISTS "Enable update for users based on id" ON employees;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON employees;
DROP POLICY IF EXISTS "Enable read access for all users" ON employees;
DROP POLICY IF EXISTS "Enable insert for service role" ON employees;
DROP POLICY IF EXISTS "Enable update for service role" ON employees;
DROP POLICY IF EXISTS "Enable delete for service role" ON employees;
DROP POLICY IF EXISTS "employees_select_policy" ON employees;
DROP POLICY IF EXISTS "employees_insert_policy" ON employees;
DROP POLICY IF EXISTS "employees_update_policy" ON employees;
DROP POLICY IF EXISTS "employees_delete_policy" ON employees;

-- Temporarily disable RLS for testing
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON employees TO authenticated;
GRANT ALL ON employees TO service_role; 