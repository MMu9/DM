-- Create users table that extends the auth.users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create purchase_orders table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  reference TEXT NOT NULL,
  date DATE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  payment_terms TEXT NOT NULL,
  delivery_terms TEXT,
  additional_notes TEXT,
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create purchase_order_items table
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  reference TEXT NOT NULL,
  date DATE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  payment_terms TEXT NOT NULL,
  delivery_terms TEXT,
  additional_notes TEXT,
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  valid_until DATE,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create quotation_items table
CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create sales_agreements table
CREATE TABLE IF NOT EXISTS public.sales_agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  reference TEXT NOT NULL,
  date DATE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  payment_terms TEXT NOT NULL,
  delivery_terms TEXT,
  additional_notes TEXT,
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create sales_agreement_items table
CREATE TABLE IF NOT EXISTS public.sales_agreement_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sales_agreement_id UUID REFERENCES public.sales_agreements(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_agreement_items ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Purchase Orders policies
-- Users can read their own purchase orders
DROP POLICY IF EXISTS "Users can view own purchase orders" ON public.purchase_orders;
CREATE POLICY "Users can view own purchase orders"
  ON public.purchase_orders FOR SELECT
  USING (auth.uid() = created_by);

-- Users can create purchase orders
DROP POLICY IF EXISTS "Users can create purchase orders" ON public.purchase_orders;
CREATE POLICY "Users can create purchase orders"
  ON public.purchase_orders FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own purchase orders
DROP POLICY IF EXISTS "Users can update own purchase orders" ON public.purchase_orders;
CREATE POLICY "Users can update own purchase orders"
  ON public.purchase_orders FOR UPDATE
  USING (auth.uid() = created_by);

-- Users can delete their own purchase orders
DROP POLICY IF EXISTS "Users can delete own purchase orders" ON public.purchase_orders;
CREATE POLICY "Users can delete own purchase orders"
  ON public.purchase_orders FOR DELETE
  USING (auth.uid() = created_by);

-- Purchase Order Items policies
-- Users can read their own purchase order items
DROP POLICY IF EXISTS "Users can view own purchase order items" ON public.purchase_order_items;
CREATE POLICY "Users can view own purchase order items"
  ON public.purchase_order_items FOR SELECT
  USING ((SELECT created_by FROM public.purchase_orders WHERE id = purchase_order_id) = auth.uid());

-- Users can create purchase order items for their own purchase orders
DROP POLICY IF EXISTS "Users can create purchase order items" ON public.purchase_order_items;
CREATE POLICY "Users can create purchase order items"
  ON public.purchase_order_items FOR INSERT
  WITH CHECK ((SELECT created_by FROM public.purchase_orders WHERE id = purchase_order_id) = auth.uid());

-- Users can update their own purchase order items
DROP POLICY IF EXISTS "Users can update own purchase order items" ON public.purchase_order_items;
CREATE POLICY "Users can update own purchase order items"
  ON public.purchase_order_items FOR UPDATE
  USING ((SELECT created_by FROM public.purchase_orders WHERE id = purchase_order_id) = auth.uid());

-- Users can delete their own purchase order items
DROP POLICY IF EXISTS "Users can delete own purchase order items" ON public.purchase_order_items;
CREATE POLICY "Users can delete own purchase order items"
  ON public.purchase_order_items FOR DELETE
  USING ((SELECT created_by FROM public.purchase_orders WHERE id = purchase_order_id) = auth.uid());

-- Similar policies for quotations and sales agreements
-- Quotations policies
DROP POLICY IF EXISTS "Users can view own quotations" ON public.quotations;
CREATE POLICY "Users can view own quotations"
  ON public.quotations FOR SELECT
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can create quotations" ON public.quotations;
CREATE POLICY "Users can create quotations"
  ON public.quotations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own quotations" ON public.quotations;
CREATE POLICY "Users can update own quotations"
  ON public.quotations FOR UPDATE
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete own quotations" ON public.quotations;
CREATE POLICY "Users can delete own quotations"
  ON public.quotations FOR DELETE
  USING (auth.uid() = created_by);

-- Quotation Items policies
DROP POLICY IF EXISTS "Users can view own quotation items" ON public.quotation_items;
CREATE POLICY "Users can view own quotation items"
  ON public.quotation_items FOR SELECT
  USING ((SELECT created_by FROM public.quotations WHERE id = quotation_id) = auth.uid());

DROP POLICY IF EXISTS "Users can create quotation items" ON public.quotation_items;
CREATE POLICY "Users can create quotation items"
  ON public.quotation_items FOR INSERT
  WITH CHECK ((SELECT created_by FROM public.quotations WHERE id = quotation_id) = auth.uid());

DROP POLICY IF EXISTS "Users can update own quotation items" ON public.quotation_items;
CREATE POLICY "Users can update own quotation items"
  ON public.quotation_items FOR UPDATE
  USING ((SELECT created_by FROM public.quotations WHERE id = quotation_id) = auth.uid());

DROP POLICY IF EXISTS "Users can delete own quotation items" ON public.quotation_items;
CREATE POLICY "Users can delete own quotation items"
  ON public.quotation_items FOR DELETE
  USING ((SELECT created_by FROM public.quotations WHERE id = quotation_id) = auth.uid());

-- Sales Agreements policies
DROP POLICY IF EXISTS "Users can view own sales agreements" ON public.sales_agreements;
CREATE POLICY "Users can view own sales agreements"
  ON public.sales_agreements FOR SELECT
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can create sales agreements" ON public.sales_agreements;
CREATE POLICY "Users can create sales agreements"
  ON public.sales_agreements FOR INSERT
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own sales agreements" ON public.sales_agreements;
CREATE POLICY "Users can update own sales agreements"
  ON public.sales_agreements FOR UPDATE
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete own sales agreements" ON public.sales_agreements;
CREATE POLICY "Users can delete own sales agreements"
  ON public.sales_agreements FOR DELETE
  USING (auth.uid() = created_by);

-- Sales Agreement Items policies
DROP POLICY IF EXISTS "Users can view own sales agreement items" ON public.sales_agreement_items;
CREATE POLICY "Users can view own sales agreement items"
  ON public.sales_agreement_items FOR SELECT
  USING ((SELECT created_by FROM public.sales_agreements WHERE id = sales_agreement_id) = auth.uid());

DROP POLICY IF EXISTS "Users can create sales agreement items" ON public.sales_agreement_items;
CREATE POLICY "Users can create sales agreement items"
  ON public.sales_agreement_items FOR INSERT
  WITH CHECK ((SELECT created_by FROM public.sales_agreements WHERE id = sales_agreement_id) = auth.uid());

DROP POLICY IF EXISTS "Users can update own sales agreement items" ON public.sales_agreement_items;
CREATE POLICY "Users can update own sales agreement items"
  ON public.sales_agreement_items FOR UPDATE
  USING ((SELECT created_by FROM public.sales_agreements WHERE id = sales_agreement_id) = auth.uid());

DROP POLICY IF EXISTS "Users can delete own sales agreement items" ON public.sales_agreement_items;
CREATE POLICY "Users can delete own sales agreement items"
  ON public.sales_agreement_items FOR DELETE
  USING ((SELECT created_by FROM public.sales_agreements WHERE id = sales_agreement_id) = auth.uid());

-- Enable realtime for all tables
alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.purchase_orders;
alter publication supabase_realtime add table public.purchase_order_items;
alter publication supabase_realtime add table public.quotations;
alter publication supabase_realtime add table public.quotation_items;
alter publication supabase_realtime add table public.sales_agreements;
alter publication supabase_realtime add table public.sales_agreement_items;
