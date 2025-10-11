-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for business types
CREATE TYPE business_type AS ENUM ('restaurant', 'hotel');

-- Create enum for reservation status
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_type business_type NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  price_range TEXT,
  opening_hours JSONB,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  number_of_people INTEGER NOT NULL,
  special_requests TEXT,
  status reservation_status NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  mpesa_transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for businesses (public read)
CREATE POLICY "Anyone can view businesses"
  ON public.businesses FOR SELECT
  USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for reservations
CREATE POLICY "Users can view their own reservations"
  ON public.reservations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations"
  ON public.reservations FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample businesses
INSERT INTO public.businesses (name, business_type, description, location, phone, price_range, rating, image_url) VALUES
  ('Carnivore Restaurant', 'restaurant', 'Famous for nyama choma and unique dining experience', 'Langata, Nairobi', '+254 20 6009000', 'KSh 2000-5000', 4.5, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'),
  ('The Tribe Hotel', 'hotel', 'Boutique hotel in the heart of Nairobi', 'Village Market, Nairobi', '+254 20 7200000', 'KSh 15000-30000', 4.8, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
  ('Talisman Restaurant', 'restaurant', 'Fine dining with international cuisine', 'Karen, Nairobi', '+254 20 8882335', 'KSh 1500-3000', 4.6, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'),
  ('Villa Rosa Kempinski', 'hotel', 'Luxury hotel with world-class amenities', 'Westlands, Nairobi', '+254 20 4238000', 'KSh 25000-50000', 4.9, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'),
  ('Java House', 'restaurant', 'Popular coffee house and restaurant chain', 'Multiple locations, Nairobi', '+254 709 950000', 'KSh 500-1500', 4.3, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800');