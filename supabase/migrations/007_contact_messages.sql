CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL CHECK (char_length(customer_name) BETWEEN 2 AND 100),
  customer_email TEXT NOT NULL CHECK (char_length(customer_email) BETWEEN 5 AND 254),
  customer_phone TEXT NOT NULL CHECK (char_length(customer_phone) BETWEEN 7 AND 30),
  reason TEXT NOT NULL CHECK (char_length(reason) BETWEEN 1 AND 100),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 4000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit contact messages" ON contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'new');

DROP POLICY IF EXISTS "Admin can manage contact messages" ON contact_messages;
CREATE POLICY "Admin can manage contact messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created_at
  ON contact_messages (status, created_at DESC);

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP POLICY IF EXISTS "Public can submit reviews" ON reviews;
CREATE POLICY "Public can submit reviews"
  ON reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (approved IS NOT TRUE);

CREATE INDEX IF NOT EXISTS idx_reviews_approved_created_at
  ON reviews (approved, created_at DESC);
