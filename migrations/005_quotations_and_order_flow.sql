-- 005_quotations_and_order_flow.sql
-- Redesign order flow: pending → quoted → paid → matched → printing → completed

-- 1. Add order-specific contact/ad info columns
ALTER TABLE public.orders
  ADD COLUMN ad_details text,
  ADD COLUMN contact_person text,
  ADD COLUMN contact_tel text,
  ADD COLUMN company_name text;

-- 2. Update order status constraint (remove 'confirmed', add 'quoted' and 'paid')
ALTER TABLE public.orders DROP CONSTRAINT orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'quoted', 'paid', 'matched', 'printing', 'completed'));

-- 3. Migrate existing 'confirmed' orders to 'paid' so they remain matchable
UPDATE public.orders SET status = 'paid' WHERE status = 'confirmed';

-- 4. Create quotations table
CREATE TABLE public.quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_number text NOT NULL UNIQUE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL,
  notes text,
  valid_until date,
  created_by uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on quotations
CREATE TRIGGER quotations_updated_at
  BEFORE UPDATE ON public.quotations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 5. Auto-generate quotation numbers: QT-YYYY-NNNN
CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS trigger AS $$
DECLARE
  current_year text;
  next_seq integer;
BEGIN
  current_year := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(substring(quotation_number from 9) AS integer)
  ), 0) + 1
  INTO next_seq
  FROM public.quotations
  WHERE quotation_number LIKE 'QT-' || current_year || '-%';

  NEW.quotation_number := 'QT-' || current_year || '-' || lpad(next_seq::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quotations_auto_number
  BEFORE INSERT ON public.quotations
  FOR EACH ROW EXECUTE FUNCTION public.generate_quotation_number();

-- 6. RLS for quotations
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Admins can fully manage quotations
CREATE POLICY "Admins can manage quotations"
  ON public.quotations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Customers can read quotations for their own orders
CREATE POLICY "Customers can read own quotations"
  ON public.quotations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = quotations.order_id
        AND orders.customer_id = auth.uid()
    )
  );
