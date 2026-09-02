-- ============================================
-- Waxora: New Tables + Seed Data
-- Migration: 005_create_new_tables
-- ============================================

-- ── FAQs Table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active FAQs"
  ON faqs FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Admin can manage FAQs"
  ON faqs FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_active ON faqs(is_active);

-- ── Studios Table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS studios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE studios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active studios"
  ON studios FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Admin can manage studios"
  ON studios FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── Gallery Images Table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  is_tall BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active gallery images"
  ON gallery_images FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Admin can manage gallery images"
  ON gallery_images FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── Site Settings Table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admin can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Seed: FAQs ────────────────────────────────────────────

INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES

('How far in advance should I book?',
 'Popular time slots — evenings and Saturdays — tend to fill up 5-7 days out. Weekday mornings and early afternoons usually have same-week availability.',
 'Booking', 1, true),

('What''s your cancellation policy?',
 'We ask for at least 24 hours'' notice to cancel or reschedule. Cancellations inside that window may be subject to a fee, which goes to the Cerologist who held that time for you.',
 'Booking', 2, true),

('How long does my hair need to be?',
 'About a quarter inch — roughly two weeks of growth for most areas. Too short and the wax can''t grip; too long and the pull is more uncomfortable than necessary. See our blog post on timing for a fuller breakdown by area.',
 'Preparation', 3, true),

('Can I wax while on medication or with sensitive skin?',
 'Some medications (retinoids, certain acne treatments, and blood thinners in particular) increase skin sensitivity or thinning, which affects whether waxing is safe. Mention any medications when you book so your Cerologist can advise or suggest an alternative service.',
 'Preparation', 4, true),

('Does it hurt?',
 'Most clients describe a brief, sharp sensation rather than lasting pain, and it becomes more comfortable as the Cerologist works through an area. First-timers are often surprised by how quick and manageable it is.',
 'During Your Visit', 5, true),

('What should I wear?',
 'Loose, comfortable clothing, especially for leg or bikini appointments — you''ll want to avoid anything tight going back on right after your service.',
 'During Your Visit', 6, true),

('What should I avoid right after waxing?',
 'Sun exposure, hot showers or baths, saunas, swimming pools, and vigorous exercise for about 24 hours. Freshly waxed skin is more sensitive to heat and friction than usual.',
 'Aftercare', 7, true),

('How do I prevent ingrown hairs between appointments?',
 'Start gentle exfoliation 48 hours after your appointment, two to three times a week, and favor looser clothing for the first day. See our blog for a full routine.',
 'Aftercare', 8, true),

('Do prices vary by location?',
 'Listed prices are our standard rates and may vary slightly by studio. You''ll always see the exact price for your selected studio before confirming a booking.',
 'Pricing', 9, true)

ON CONFLICT DO NOTHING;

-- ── Seed: Studios ─────────────────────────────────────────

INSERT INTO studios (name, address, phone, hours, display_order, is_active) VALUES

('Waxora — Downtown', '412 Elm Street, Suite 2, Riverton', '(555) 013-7788', 'Mon–Sat 9am–7pm, Sun 10am–4pm', 1, true),
('Waxora — Northside', '88 Birchwood Ave, Riverton', '(555) 013-4420', 'Mon–Sat 9am–7pm, Sun closed', 2, true)

ON CONFLICT DO NOTHING;

-- ── Seed: Gallery Images ──────────────────────────────────

INSERT INTO gallery_images (src, alt, is_tall, display_order, is_active) VALUES

('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', 'Treatment room with soft lighting', true, 1, true),
('https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80', 'Skincare products on a counter', false, 2, true),
('https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&q=80', 'Studio waiting area', false, 3, true),
('https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80', 'Esthetician preparing for an appointment', true, 4, true),
('https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80', 'Neatly arranged studio towels', false, 5, true),
('https://images.unsplash.com/photo-1470259078422-826894b933aa?w=800&q=80', 'Front desk and reception area', false, 6, true)

ON CONFLICT DO NOTHING;

-- ── Seed: Site Settings ───────────────────────────────────

INSERT INTO site_settings (key, value) VALUES

('homepage_stats', '[
  {"value": "4.9", "label": "Average rating"},
  {"value": "12k+", "label": "Appointments a year"},
  {"value": "2", "label": "Studio locations"}
]'),

('hero_images', '[
  {"src": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80", "alt": "A calm, softly lit waxing studio treatment room"},
  {"src": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80", "alt": "Skincare products arranged on a studio counter"},
  {"src": "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=900&q=80", "alt": "An esthetician preparing wax during an appointment"}
]'),

('why_us_bullets', '[
  "Single-use application sticks, every time",
  "Low-temperature wax suited to sensitive skin",
  "Private rooms for every body service"
]'),

('company_values', '[
  {"title": "Trained, not just certified", "body": "Every Cerologist completes supervised hands-on hours before working solo — certification is the floor, not the finish line."},
  {"title": "Say what''s happening", "body": "You''ll know what area is next and what to expect before it happens. No surprises mid-service."},
  {"title": "No pressure add-ons", "body": "We''ll mention a service if it genuinely fits what you''re asking for. We won''t if it doesn''t."}
]'),

('about_hero_image', '{"src": "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=900&q=80", "alt": "Interior of a calm, plant-filled waxing studio"}'),

('site_metadata', '{"title": "Waxora", "description": "Waxing services — browse, book, and manage your appointments online."}')

ON CONFLICT (key) DO NOTHING;
