-- ============================================
-- Waxora RLS Policies
-- Migration: 002_rls_policies
-- ============================================

-- Enable Row Level Security on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Helper function: Check if user is admin
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Services Policies
-- ============================================
-- Public: Read active services
CREATE POLICY "Public can read active services"
  ON services FOR SELECT
  TO anon
  USING (is_active = true);

-- Admin: Full access
CREATE POLICY "Admin can manage services"
  ON services FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- Bookings Policies
-- ============================================
-- Public: Create bookings (via server-side only)
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin: Full access
CREATE POLICY "Admin can manage bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- Reviews Policies
-- ============================================
-- Public: Read approved reviews
CREATE POLICY "Public can read approved reviews"
  ON reviews FOR SELECT
  TO anon
  USING (approved = true);

-- Public: Submit reviews
CREATE POLICY "Public can submit reviews"
  ON reviews FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin: Full access
CREATE POLICY "Admin can manage reviews"
  ON reviews FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- Blog Posts Policies
-- ============================================
-- Public: Read published posts
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  TO anon
  USING (published = true);

-- Admin: Full access
CREATE POLICY "Admin can manage blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- Business Hours Policies
-- ============================================
-- Public: Read business hours
CREATE POLICY "Public can read business hours"
  ON business_hours FOR SELECT
  TO anon
  USING (true);

-- Admin: Full access
CREATE POLICY "Admin can manage business hours"
  ON business_hours FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- Blocked Times Policies
-- ============================================
-- Public: Read blocked times (limited info)
CREATE POLICY "Public can read blocked times"
  ON blocked_times FOR SELECT
  TO anon
  USING (true);

-- Admin: Full access
CREATE POLICY "Admin can manage blocked times"
  ON blocked_times FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- Admins Policies
-- ============================================
-- Admin: Read own record
CREATE POLICY "Admin can read own record"
  ON admins FOR SELECT
  TO authenticated
  USING (id = auth.uid());
