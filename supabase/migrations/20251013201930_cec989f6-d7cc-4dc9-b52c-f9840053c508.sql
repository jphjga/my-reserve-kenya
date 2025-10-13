-- Add INSERT policy for business_users table to allow signup
CREATE POLICY "Users can insert their own business_user record"
ON public.business_users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);