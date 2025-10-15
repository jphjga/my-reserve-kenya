-- Create trigger to notify customers when business replies
CREATE OR REPLACE FUNCTION public.notify_on_business_reply()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  customer_id uuid;
BEGIN
  -- Only notify if message is from business
  IF NEW.is_from_business = true THEN
    -- Get customer ID from the conversation
    SELECT sender_id INTO customer_id
    FROM public.messages
    WHERE conversation_id = NEW.conversation_id
      AND is_from_business = false
    LIMIT 1;
    
    -- Create notification for customer
    IF customer_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, message, type, related_id)
      VALUES (
        customer_id,
        'New message from business',
        'You have a new reply to your message',
        'message',
        NEW.conversation_id
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_business_message_reply
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_business_reply();