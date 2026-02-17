-- 006_fix_rls_recursion.sql
-- Fix infinite recursion in RLS policies
-- The admin policies on profiles check profiles itself, causing infinite recursion.
-- Solution: use a SECURITY DEFINER function that bypasses RLS to check admin role.

-- 1. Create a helper function that bypasses RLS to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Fix profiles policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- 3. Fix orders policies
DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
CREATE POLICY "Admins can read all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- 4. Fix match_groups policies (if they exist with the same pattern)
DROP POLICY IF EXISTS "Admins can manage match groups" ON public.match_groups;
CREATE POLICY "Admins can manage match groups"
  ON public.match_groups FOR ALL
  USING (public.is_admin());

-- 5. Fix match_group_members policies
DROP POLICY IF EXISTS "Admins can manage match group members" ON public.match_group_members;
CREATE POLICY "Admins can manage match group members"
  ON public.match_group_members FOR ALL
  USING (public.is_admin());

-- 6. Fix quotations policies
DROP POLICY IF EXISTS "Admins can manage quotations" ON public.quotations;
CREATE POLICY "Admins can manage quotations"
  ON public.quotations FOR ALL
  USING (public.is_admin());
