-- Create event_type enum
CREATE TYPE event_type AS ENUM ('time_based_event', 'service_booking');

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true);

-- Storage RLS policies
CREATE POLICY "Public can view event images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY "Business users can upload event images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'event-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Business users can update their event images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'event-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Business users can delete their event images"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-images' AND auth.uid() IS NOT NULL);

-- Update events table
ALTER TABLE public.events 
ADD COLUMN event_type event_type DEFAULT 'time_based_event' NOT NULL,
ADD COLUMN requires_upfront_payment boolean DEFAULT true,
ADD COLUMN booking_item_type text;

-- Update messages table
ALTER TABLE public.messages 
ADD COLUMN reservation_id uuid REFERENCES public.reservations(id),
ADD COLUMN conversation_id uuid,
ADD COLUMN is_read boolean DEFAULT false;

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_reservation ON public.messages(reservation_id);

-- Update reservations table
ALTER TABLE public.reservations 
ADD COLUMN booking_item_description text;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;