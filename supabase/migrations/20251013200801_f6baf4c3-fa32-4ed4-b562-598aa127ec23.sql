-- Update business_type enum to include new types
ALTER TYPE business_type ADD VALUE IF NOT EXISTS 'garden';
ALTER TYPE business_type ADD VALUE IF NOT EXISTS 'club';

-- Add profile_completed column to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS profile_completed boolean DEFAULT false;

-- Update RLS policies for businesses to allow business users to update their own business
CREATE POLICY "Business users can update their own business"
ON public.businesses
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.business_users
    WHERE business_users.business_id = businesses.id
    AND business_users.id = auth.uid()
  )
);

-- Allow authenticated users to insert businesses (for signup)
CREATE POLICY "Authenticated users can create businesses"
ON public.businesses
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);