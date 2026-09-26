-- ============================================
-- Waxora: Recreate blocked_times (drift fix)
-- Migration: 008_recreate_blocked_times
-- ============================================
-- The live database is missing blocked_times, which makes every
-- booking fail with "Could not check blocked appointment times."
-- Idempotent: safe to run more than once.

CREATE TABLE IF NOT EXISTS blocked_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_blocked_times_datetime
  ON blocked_times (start_datetime, end_datetime);

DROP POLICY IF EXISTS "Public can read blocked times" ON blocked_times;

CREATE POLICY "Public can read blocked times"
  ON blocked_times FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Admin can manage blocked times" ON blocked_times;

CREATE POLICY "Admin can manage blocked times"
  ON blocked_times FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
