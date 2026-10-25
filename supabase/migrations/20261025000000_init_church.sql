-- Supabase Schema for Virtual Church
-- Run in Supabase SQL editor or via Supabase CLI

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_choice TEXT DEFAULT 'default',
    avatar_color TEXT DEFAULT '#3b82f6',
    is_pastor BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'visitor' CHECK (role IN ('visitor', 'pastor', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Note: is_pastor and role cannot be modified by ordinary users (security rule)
CREATE POLICY "Users can update their own profile fields" 
ON public.profiles FOR UPDATE USING (
    auth.uid() = id
) WITH CHECK (
    auth.uid() = id AND 
    -- Ensure users cannot elevate themselves to pastor or admin
    (is_pastor = (SELECT is_pastor FROM public.profiles WHERE id = auth.uid())) AND
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
);

-- 2. Donation Methods (Tier A & Tier B configurations)
CREATE TABLE IF NOT EXISTS public.donation_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('qris', 'bank', 'ewallet', 'platform', 'gateway')),
    title TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    account_number TEXT,
    account_holder TEXT,
    qr_image_url TEXT,
    external_url TEXT,
    instructions TEXT,
    badge TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.donation_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active donation methods viewable by anyone" 
ON public.donation_methods FOR SELECT USING (is_active = true);

-- Seed initial default donation options (can be customized via Supabase dashboard)
INSERT INTO public.donation_methods (category, title, provider_name, account_number, account_holder, qr_image_url, external_url, instructions, badge, display_order)
VALUES 
('qris', 'QRIS Universal Payment', 'QRIS', NULL, 'Gereja Online Indonesia', '/assets/qris-church-mock.svg', NULL, 'Scan using BCA, Mandiri, GoPay, OVO, Dana, ShopeePay, or any Indonesian banking app.', 'Instant QR', 1),
('bank', 'BCA Transfer', 'Bank Central Asia (BCA)', '8830129384', 'Gereja Online Indonesia', NULL, NULL, 'ATM / Mobile Banking BCA transfer. Realtime 24/7.', 'Transfer Bank', 2),
('bank', 'Mandiri Transfer', 'Bank Mandiri', '1370019283741', 'Gereja Online Indonesia', NULL, NULL, 'ATM / Livin by Mandiri transfer.', 'Transfer Bank', 3),
('ewallet', 'GoPay / OVO / Dana', 'E-Wallet Transfer', '081234567890', 'Gereja Online', NULL, NULL, 'Direct transfer to church e-wallet.', 'E-Wallet', 4),
('platform', 'Saweria Church Fund', 'Saweria', NULL, NULL, NULL, 'https://saweria.co', 'Support via Saweria with custom blessing messages.', 'Saweria', 5),
('platform', 'Trakteer Fellowship', 'Trakteer', NULL, NULL, NULL, 'https://trakteer.id', 'Support with Trakteer units and rewards.', 'Trakteer', 6);

-- 3. Donations Record Table (For Tier C automated or recorded transactions)
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    donor_name TEXT NOT NULL DEFAULT 'Anonymous',
    donor_email TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'IDR',
    payment_method TEXT NOT NULL,
    provider_reference TEXT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a donation record" 
ON public.donations FOR INSERT WITH CHECK (true);

CREATE POLICY "Donors can view their own donations" 
ON public.donations FOR SELECT USING (auth.uid() = user_id);
