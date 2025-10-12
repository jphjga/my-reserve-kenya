-- Create business_users table for business authentication
CREATE TABLE public.business_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for business_users
ALTER TABLE public.business_users ENABLE ROW LEVEL SECURITY;

-- Business users can view their own record
CREATE POLICY "Business users can view their own record"
ON public.business_users
FOR SELECT
USING (auth.uid() = id);

-- Business users can update their own record
CREATE POLICY "Business users can update their own record"
ON public.business_users
FOR UPDATE
USING (auth.uid() = id);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  ticket_price NUMERIC NOT NULL DEFAULT 0,
  total_tickets INTEGER NOT NULL,
  available_tickets INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Everyone can view events
CREATE POLICY "Anyone can view events"
ON public.events
FOR SELECT
USING (true);

-- Business users can manage their own events
CREATE POLICY "Business users can create events"
ON public.events
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.business_users
    WHERE business_users.id = auth.uid()
    AND business_users.business_id = events.business_id
  )
);

CREATE POLICY "Business users can update their own events"
ON public.events
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.business_users
    WHERE business_users.id = auth.uid()
    AND business_users.business_id = events.business_id
  )
);

CREATE POLICY "Business users can delete their own events"
ON public.events
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.business_users
    WHERE business_users.id = auth.uid()
    AND business_users.business_id = events.business_id
  )
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Create messages table for communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_from_business BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages related to them
CREATE POLICY "Users can view their own messages"
ON public.messages
FOR SELECT
USING (auth.uid() = sender_id);

-- Business users can view messages for their business
CREATE POLICY "Business users can view their business messages"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.business_users
    WHERE business_users.id = auth.uid()
    AND business_users.business_id = messages.business_id
  )
);

-- Users can create messages
CREATE POLICY "Users can create messages"
ON public.messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Business users can create messages
CREATE POLICY "Business users can create messages"
ON public.messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.business_users
    WHERE business_users.id = auth.uid()
    AND business_users.business_id = messages.business_id
  )
);

-- Add businesses column to track if business account exists
ALTER TABLE public.businesses
ADD COLUMN has_account BOOLEAN DEFAULT false;

-- Create function to handle business user creation
CREATE OR REPLACE FUNCTION public.handle_new_business_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update business to mark it has an account
  UPDATE public.businesses
  SET has_account = true
  WHERE id = NEW.business_id;
  
  RETURN NEW;
END;
$$;

-- Trigger for new business users
CREATE TRIGGER on_business_user_created
  AFTER INSERT ON public.business_users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_business_user();

-- Create function to create notification when reservation status changes
CREATE OR REPLACE FUNCTION public.notify_reservation_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_id)
    VALUES (
      NEW.user_id,
      'Reservation Status Updated',
      'Your reservation status has been updated to: ' || NEW.status,
      'reservation',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for reservation status changes
CREATE TRIGGER on_reservation_status_change
  AFTER UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_reservation_status_change();