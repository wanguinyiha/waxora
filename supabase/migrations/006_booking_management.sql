ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS management_token_hash TEXT;

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS management_token_expires_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_management_token_hash
  ON bookings (management_token_hash)
  WHERE management_token_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_management_token_expiry
  ON bookings (management_token_expires_at)
  WHERE management_token_expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_calendar
  ON bookings (appointment_date, start_time)
  WHERE status IN ('pending', 'confirmed');
