-- Add missing INSERT policy for profiles table
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Fix function security by setting secure search paths
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Create a function to check admin role securely
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Update admin policies to use the secure function
DROP POLICY IF EXISTS "Admin can manage email settings" ON public.email_settings;
DROP POLICY IF EXISTS "Admin can view email logs" ON public.email_logs;

CREATE POLICY "Admin can manage email settings" 
ON public.email_settings 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admin can view email logs" 
ON public.email_logs 
FOR SELECT 
USING (public.is_admin());

-- Create proper admin user (replace the hardcoded login)
-- This will be created when admin first signs up with zedbites@gmail.com