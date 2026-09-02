-- ============================================
-- Waxora Seed: Services, Blog Posts, Reviews
-- Migration: 004_seed_existing_tables
-- ============================================

-- ── Add missing columns to services table ─────────────────
ALTER TABLE services
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Face';

ALTER TABLE services
ADD COLUMN IF NOT EXISTS popular BOOLEAN DEFAULT false;

ALTER TABLE services ADD COLUMN IF NOT EXISTS includes JSONB DEFAULT '[]'::jsonb;

ALTER TABLE services ADD COLUMN IF NOT EXISTS prep JSONB DEFAULT '[]'::jsonb;

-- Migrate preparation → prep if preparation exists and prep is empty
UPDATE services SET prep = to_jsonb(preparation) WHERE preparation IS NOT NULL AND (prep IS NULL OR prep = '[]'::jsonb);

CREATE INDEX IF NOT EXISTS idx_services_category ON services (category);

-- ── Add missing columns to blog_posts table ───────────────
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS read_time TEXT DEFAULT '';

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_array JSONB DEFAULT '[]'::jsonb;

-- ── Add missing columns to reviews table ──────────────────
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS service TEXT DEFAULT '';

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS date TEXT DEFAULT '';

-- ── Services ──────────────────────────────────────────────

INSERT INTO
    services (
        slug,
        category,
        name,
        price,
        duration_minutes,
        short_description,
        description,
        includes,
        prep,
        aftercare,
        popular,
        is_active
    )
VALUES

-- Face
(
    'eyebrow-wax',
    'Face',
    'Eyebrow Wax',
    2200,
    15,
    'Professional eyebrow shaping to create a clean, defined brow shape.',
    'Professional eyebrow waxing to remove unwanted hair and create a clean, defined eyebrow shape. The skin is cleansed, wax is applied to unwanted hair, and the hair is removed from the root. The brows are then cleaned and shaped to create a neat, balanced appearance.',
    '["Hair removal around the eyebrows","Brow shaping","Cleaning stray hairs"]',
    '["Let brows grow for at least 2 weeks since your last shape.","Skip retinol or exfoliating acids on the brow area for 48 hours prior.","Arrive with a rough idea of the shape you like, or trust us to guide you."]',
    '["Avoid touching or applying makeup to the area for 4 hours.","Skip saunas, steam rooms, and direct sun for 24 hours.","Apply a fragrance-free moisturizer if any tightness appears."]',
    true,
    true
),
(
    'upper-lip-wax',
    'Face',
    'Upper Lip Wax',
    1500,
    10,
    'Quick and precise removal of unwanted hair from the upper lip area.',
    'A small amount of wax is applied to the upper lip and removed quickly to take the hair from the root. A fast, low-heat wax designed for the delicate skin on the upper lip.',
    NULL,
    '["Avoid sun exposure and tanning for 24 hours before your visit.","Discontinue Retin-A or similar treatments on the area for 5-7 days."]',
    '["Keep the area clean and avoid exfoliating or applying strong skincare products immediately after treatment.","A cool compress helps if the skin feels warm afterward."]',
    false,
    true
),
(
    'chin-wax',
    'Face',
    'Chin Wax',
    1500,
    10,
    'Removes unwanted facial hair from the chin for a smooth, clean finish.',
    'Targeted waxing for the chin area to remove unwanted hair from the root. Ideal for maintaining a smooth jawline between appointments.',
    NULL,
    '["Let hair grow to at least a quarter inch.","Avoid heavy skincare products on the area for 24 hours before."]',
    '["Avoid touching the area for a few hours.","Skip direct sun and heat for 24 hours."]',
    false,
    true
),
(
    'sideburn-wax',
    'Face',
    'Sideburn Wax',
    1800,
    10,
    'Removes unwanted hair along the side of the face and sideburn area.',
    'Hair removal along the side of the face to create a cleaner, more defined facial轮廓. Perfect for clients who want a polished look without the commitment of other methods.',
    NULL,
    '["Let hair grow to at least a quarter inch.","Avoid sun exposure for 24 hours before."]',
    '["Avoid touching the area for a few hours.","Skip makeup on the treated area for 4 hours."]',
    false,
    true
),
(
    'full-face-wax',
    'Face',
    'Full Face Wax',
    4500,
    30,
    'A complete facial waxing treatment for smooth, hair-free skin.',
    'Everything above the neckline, handled in one visit. Your Cerologist works section by section with our custom wax, which is formulated to grip hair — not skin — so facial waxing stays comfortable even on sensitive areas.',
    '["Forehead","Eyebrows","Upper lip","Chin","Cheeks","Sideburn area"]',
    '["Let hair grow to at least a quarter inch (about 2 weeks).","Pause retinoids and acids for 5-7 days before your appointment."]',
    '["Avoid direct sun and heat for 24 hours.","Use a fragrance-free SPF daily afterward — freshly waxed skin sunburns faster."]',
    true,
    true
),
(
    'nose-wax',
    'Face',
    'Nose Wax',
    1500,
    10,
    'Gentle removal of visible unwanted hair around the nostril area.',
    'A quick and comfortable treatment that removes visible hair from the nostrils. Uses a specialized wax designed for the sensitive nasal area.',
    NULL,
    '["Ensure nose area is clean and free of moisturizers.","Blow your nose shortly before the appointment."]',
    '["Avoid picking or blowing your nose vigorously for a few hours.","Keep the area clean."]',
    false,
    true
),
(
    'ear-wax',
    'Face',
    'Ear Wax',
    1500,
    10,
    'Removal of visible unwanted hair from the outer ear area.',
    'Professional removal of visible hair from the outer ear. A quick treatment that leaves the ear area looking clean and tidy.',
    NULL,
    '["Ensure ear area is clean."]',
    '["Avoid inserting anything into the ear for a few hours."]',
    false,
    true
),

-- Body
(
    'underarm-wax',
    'Body',
    'Underarm Wax',
    2500,
    15,
    'Smooth results that outlast shaving by weeks, not days.',
    'A commonly re-booked service once clients feel the difference — regrowth comes back finer and sparser over time, and there''s no stubble the next morning. The area is cleansed and prepared before warm wax is applied. The wax is removed quickly, taking the hair from the root.',
    NULL,
    '["Hair should be at least a quarter inch long.","Skip deodorant on the morning of your appointment.","Gently exfoliate the day before, not the day of."]',
    '["Hold off on deodorant and tight clothing for a few hours.","Exfoliate lightly starting 48 hours after your appointment to prevent ingrowns."]',
    true,
    true
),
(
    'full-arm-wax',
    'Body',
    'Full Arm Wax',
    4000,
    30,
    'Complete hair removal from the arms for smooth, even-looking skin.',
    'Full coverage waxing from shoulders to wrists. Includes upper arms, forearms, around the elbows, and hands/fingers where appropriate.',
    '["Upper arms","Forearms","Around the elbows","Hands/fingers where appropriate"]',
    '["Let hair grow for at least 2 weeks.","Moisturize the night before, not the morning of."]',
    '["Avoid hot showers and tight clothing for 24 hours.","Begin exfoliating after 48 hours to keep skin smooth between visits."]',
    false,
    true
),
(
    'half-arm-wax',
    'Body',
    'Half Arm Wax',
    2500,
    20,
    'Hair removal from either the upper or lower portion of the arm.',
    'Choose between upper arm or lower arm waxing. A great option if you only need specific areas treated.',
    NULL,
    '["Let hair grow for at least 2 weeks.","Moisturize the night before, not the morning of."]',
    '["Avoid hot showers and tight clothing for 24 hours.","Begin exfoliating after 48 hours."]',
    false,
    true
),
(
    'full-leg-wax',
    'Body',
    'Full Leg Wax',
    6500,
    45,
    'Ankle to hip, done efficiently and evenly.',
    'Full coverage from ankle to hip using our custom wax, applied and removed in sections to keep the appointment moving without rushing any one area.',
    '["Thighs","Knees","Lower legs","Ankles"]',
    '["Let hair grow for at least 2 weeks.","Avoid sun exposure or tanning beds for 24 hours prior."]',
    '["Wear loose clothing home.","Skip hot baths and vigorous exercise for the rest of the day."]',
    true,
    true
),
(
    'half-leg-wax',
    'Body',
    'Half Leg Wax',
    4000,
    30,
    'Knee-down or knee-up smoothing, your choice.',
    'A great entry point for first-time leg waxers, or a quick top-up between full-leg appointments. Choose between upper or lower leg.',
    NULL,
    '["Let hair grow for at least 2 weeks.","Moisturize the night before, not the morning of."]',
    '["Avoid hot showers, saunas, and tight leggings for 24 hours.","Begin exfoliating after 48 hours to keep skin smooth between visits."]',
    false,
    true
),
(
    'full-body-wax',
    'Body',
    'Full Body Wax',
    15000,
    90,
    'A comprehensive waxing experience covering multiple areas of the body in one appointment.',
    'A complete body waxing service covering multiple areas in one session. The exact areas included are confirmed during your consultation so you know exactly what to expect.',
    '["Full legs","Full arms","Underarms","Bikini area","Back","Stomach"]',
    '["Let hair grow for at least 2 weeks across all areas.","Take an over-the-counter pain reliever 30-40 minutes ahead if you''re sensitive.","Wear loose, comfortable clothing to your appointment."]',
    '["Wear loose, breathable clothing for the rest of the day.","Avoid exercise, hot tubs, and swimming pools for 24 hours.","Exfoliate starting 48 hours after to prevent ingrown hairs."]',
    false,
    true
),

-- Bikini & Intimate
(
    'bikini-wax',
    'Bikini & Intimate',
    'Bikini Wax',
    3500,
    20,
    'A clean line just beyond where a swimsuit sits.',
    'Removes hair that would peek outside standard swimwear, without going further. A comfortable, straightforward option if you''re new to bikini waxing.',
    NULL,
    '["Hair should be at least a quarter inch long.","Take an over-the-counter pain reliever 30-40 minutes ahead if you''re sensitive."]',
    '["Wear breathable cotton underwear for the rest of the day.","Avoid exercise, hot tubs, and tight clothing for 24 hours."]',
    false,
    true
),
(
    'extended-bikini-wax',
    'Bikini & Intimate',
    'Extended Bikini Wax',
    4500,
    25,
    'A more extensive bikini wax that removes hair further along the bikini line.',
    'Goes beyond the standard bikini line to remove more hair from a wider area. Ideal for swimsuits or underwear with narrower coverage.',
    NULL,
    '["Hair should be at least a quarter inch long.","Take an over-the-counter pain reliever 30-40 minutes ahead if you''re sensitive."]',
    '["Wear breathable cotton underwear for the rest of the day.","Avoid exercise, hot tubs, and tight clothing for 24 hours."]',
    false,
    true
),
(
    'brazilian-wax',
    'Bikini & Intimate',
    'Brazilian Wax',
    5500,
    30,
    'Full removal, front to back, with a Cerologist who''s done it thousands of times.',
    'Our most requested body service. A thorough intimate waxing treatment that removes most or all hair from the front and back intimate areas, according to your preference. Handled with a clear, step-by-step process and constant check-ins, so you always know what''s happening next.',
    NULL,
    '["Hair should be at least a quarter inch long — trim if it''s longer than half an inch.","Take an over-the-counter pain reliever 30-40 minutes ahead if you''re sensitive.","Avoid caffeine right before your appointment; it can heighten sensitivity.","Arrive with clean skin."]',
    '["Wear loose, breathable clothing for the rest of the day.","Avoid exercise, hot tubs, and swimming pools for 24 hours.","Exfoliate starting 48 hours after to prevent ingrown hairs.","Keep the area clean and avoid unnecessary friction."]',
    true,
    true
),
(
    'hollywood-wax',
    'Bikini & Intimate',
    'Hollywood Wax',
    6500,
    40,
    'A complete intimate waxing treatment that removes all hair from the front and back intimate areas.',
    'The most thorough intimate waxing service available. All unwanted hair is removed from the front and back intimate areas for a completely smooth result.',
    NULL,
    '["Hair should be at least a quarter inch long — trim if it''s longer than half an inch.","Take an over-the-counter pain reliever 30-40 minutes ahead if you''re sensitive.","Avoid caffeine right before your appointment.","Arrive with clean skin."]',
    '["Wear loose, breathable clothing for the rest of the day.","Avoid exercise, hot tubs, and swimming pools for 24 hours.","Exfoliate starting 48 hours after to prevent ingrown hairs.","Keep the area clean and avoid unnecessary friction."]',
    false,
    true
),
(
    'buttocks-wax',
    'Bikini & Intimate',
    'Buttocks Wax',
    4000,
    20,
    'Removes unwanted hair from the buttocks area for a smooth finish.',
    'Professional hair removal from the buttocks area. Performed with care and attention to comfort and hygiene.',
    NULL,
    '["Hair should be at least a quarter inch long.","Arrive with clean skin."]',
    '["Wear loose, breathable clothing.","Avoid sitting on hard surfaces for a few hours.","Keep the area clean."]',
    false,
    true
),

-- Back & Torso
(
    'full-back-wax',
    'Back & Torso',
    'Full Back Wax',
    5500,
    35,
    'Professional hair removal across the back for smooth, clean-looking skin.',
    'Complete back waxing from shoulders to lower back. A thorough treatment that leaves the entire back area smooth.',
    '["Upper back","Mid-back","Lower back"]',
    '["Let hair grow for at least 2 weeks.","Exfoliate gently the day before."]',
    '["Avoid tight clothing for 24 hours.","Begin exfoliating after 48 hours to prevent ingrown hairs."]',
    false,
    true
),
(
    'chest-wax',
    'Back & Torso',
    'Chest Wax',
    4500,
    30,
    'Removes unwanted chest hair for a smoother appearance.',
    'Professional waxing for the chest area. Removes hair from the root for smooth, long-lasting results.',
    NULL,
    '["Let hair grow for at least 2 weeks.","Exfoliate gently the day before."]',
    '["Avoid tight clothing for 24 hours.","Begin exfoliating after 48 hours."]',
    false,
    true
),
(
    'stomach-wax',
    'Back & Torso',
    'Stomach Wax',
    3500,
    20,
    'Removes unwanted hair from the stomach area.',
    'Targeted waxing for the stomach area. A quick treatment that removes hair from the root for smooth skin.',
    NULL,
    '["Let hair grow for at least 2 weeks."]',
    '["Avoid tight clothing for 24 hours."]',
    false,
    true
),
(
    'chest-and-stomach-wax',
    'Back & Torso',
    'Chest & Stomach Wax',
    7000,
    45,
    'A combined treatment for a smoother chest and stomach area.',
    'Full coverage waxing for the entire torso — chest and stomach combined. A comprehensive treatment for clients who want complete smoothness.',
    '["Full chest","Upper stomach","Lower stomach"]',
    '["Let hair grow for at least 2 weeks.","Exfoliate gently the day before."]',
    '["Avoid tight clothing for 24 hours.","Begin exfoliating after 48 hours."]',
    false,
    true
),

-- Packages
(
    'smooth-and-simple',
    'Packages',
    'Smooth & Simple',
    8000,
    45,
    'Underarms, bikini, and half legs — the essentials in one visit.',
    'Our most popular combination package. Get three essential areas done in one efficient appointment: underarms, bikini, and half legs.',
    '["Underarms","Bikini","Half legs"]',
    '["Let hair grow for at least 2 weeks across all areas.","Take an over-the-counter pain reliever 30-40 minutes ahead if you''re sensitive."]',
    '["Wear loose, breathable clothing for the rest of the day.","Avoid exercise, hot tubs, and tight clothing for 24 hours.","Exfoliate starting 48 hours after to prevent ingrown hairs."]',
    true,
    true
),
(
    'full-body-smooth',
    'Packages',
    'Full Body Smooth',
    18000,
    90,
    'Full legs, full arms, underarms, and bikini — the complete package.',
    'Our most comprehensive package for clients who want everything done in one visit. Includes full legs, full arms, underarms, and bikini area.',
    '["Full legs","Full arms","Underarms","Bikini"]',
    '["Let hair grow for at least 2 weeks across all areas.","Take an over-the-counter pain reliever 30-40 minutes ahead if you''re sensitive.","Wear loose, comfortable clothing to your appointment."]',
    '["Wear loose, breathable clothing for the rest of the day.","Avoid exercise, hot tubs, and swimming pools for 24 hours.","Exfoliate starting 48 hours after to prevent ingrown hairs."]',
    false,
    true
),
(
    'face-fresh',
    'Packages',
    'Face Fresh',
    4500,
    25,
    'Eyebrows, upper lip, and chin — a complete facial waxing session.',
    'The perfect combination for a fresh, clean face. Includes eyebrow shaping, upper lip, and chin waxing in one quick visit.',
    '["Eyebrows","Upper lip","Chin"]',
    '["Let facial hair grow for at least 2 weeks.","Pause retinoids and acids for 5-7 days before your appointment."]',
    '["Avoid direct sun and heat for 24 hours.","Use a fragrance-free SPF daily afterward."]',
    false,
    true
),
(
    'brazilian-care-package',
    'Packages',
    'Brazilian Care Package',
    7500,
    40,
    'Brazilian wax plus underarms and aftercare guidance.',
    'Our Brazilian service combined with underarms and comprehensive aftercare guidance. Perfect for first-timers or clients who want the full intimate waxing experience with expert advice.',
    '["Brazilian","Underarms","Aftercare guidance"]',
    '["Hair should be at least a quarter inch long across all areas.","Take an over-the-counter pain reliever 30-40 minutes ahead if you''re sensitive.","Avoid caffeine right before your appointment."]',
    '["Wear loose, breathable clothing for the rest of the day.","Avoid exercise, hot tubs, and swimming pools for 24 hours.","Exfoliate starting 48 hours after to prevent ingrown hairs.","Follow the personalized aftercare routine provided by your Cerologist."]',
    false,
    true
) ON CONFLICT (slug) DO NOTHING;

-- ── Blog Posts ────────────────────────────────────────────

INSERT INTO
    blog_posts (
        slug,
        title,
        excerpt,
        category,
        read_time,
        published_at,
        published,
        content_array
    )
VALUES (
        'how-long-should-hair-be-before-waxing',
        'How Long Should Your Hair Be Before Waxing?',
        'The single biggest factor in a smooth, low-pain appointment isn''t the wax — it''s timing your visit right.',
        'Preparation',
        '4 min read',
        '2026-07-14',
        true,
        '["Wax needs something to grip. Too short, and it slides right past the hair; too long, and the pull is more uncomfortable than it needs to be. A quarter inch — roughly the length of a grain of rice — is the sweet spot for most areas.","If it''s been less than two weeks since your last shave, you''re probably not ready. If you shaved recently and have an appointment coming up, it''s worth pushing the appointment back rather than showing up early and getting a patchy result.","Hair grows at different rates across your body, so a bikini appointment and a brow appointment won''t always line up on the same schedule. Ask your Cerologist during your visit when to expect to be ready for the next one — they''ll factor in your specific growth cycle.","Here''s a general guideline by area: Eyebrows and upper lip hair tend to be fine and grow quickly, so two weeks is usually enough. Underarm and bikini hair is coarser and may need closer to three weeks. Leg hair varies, but most clients are ready between three and four weeks.","If you''re unsure whether you''re ready, call or message us before your appointment. We''d rather help you reschedule than have you sit through a session that doesn''t give you the best result."]'
    ),
    (
        'first-brazilian-what-to-expect',
        'Your First Brazilian: What Actually Happens',
        'No exaggeration, no minimizing — a straightforward walkthrough of what a first appointment looks like.',
        'First-Timers',
        '6 min read',
        '2026-06-02',
        true,
        '["You''ll start in a private room with your Cerologist, who will ask a few quick questions about your skin, any medications, and what you''d like the end result to look like. This is a good time to mention any sensitivities, allergies, or concerns — there are no awkward questions in this room.","The appointment moves in sections — front, sides, back — with wax applied and removed in short strips. Most clients describe the sensation as a quick pinch rather than ongoing pain, and it becomes more comfortable as the appointment continues.","Your Cerologist will explain each step before it happens. You''ll always know what area is being worked on and what to expect. If you need a break at any point, just say so — the pace is always yours.","The whole thing takes about 30 minutes. Most people are surprised at how routine it feels by the end, and how normal talking through the process makes it. There''s no reason to arrive extra early or take the day off afterward — most clients go straight back to their day.","After the treatment, your Cerologist will walk you through basic aftercare: wear loose clothing, avoid heat and friction for 24 hours, and start gentle exfoliation after 48 hours to keep ingrowns at bay. That''s it — you''re done.","For best results, plan to rebook in three to four weeks. Regular waxing tends to make each session quicker and more comfortable as hair grows back finer over time."]'
    ),
    (
        'ingrown-hair-prevention',
        'Five Habits That Actually Prevent Ingrown Hairs',
        'Most ingrown hairs are preventable with a short routine between appointments.',
        'Aftercare',
        '5 min read',
        '2026-05-20',
        true,
        '["Ingrown hairs happen when regrowth curls back into the skin instead of pushing through. The two biggest levers you have are exfoliation and loose clothing in the days right after waxing.","Start light exfoliation 48 hours after your appointment — a soft washcloth or a gentle chemical exfoliant, not a harsh scrub right on freshly waxed skin. Keep it up two to three times a week between visits.","Tight clothing traps regrowth against the skin, especially in the bikini area. Cotton underwear and looser pants for the first day make a bigger difference than most people expect.","Moisturize regularly, but skip heavy oils and fragranced lotions for the first 24 hours. After that, a simple, fragrance-free moisturizer keeps skin supple and helps hair push through naturally.","If you do get an ingrown, resist picking at it. A warm compress and consistent gentle exfoliation will usually resolve it faster and with less irritation than trying to extract it yourself.","And finally, stick to your waxing schedule. When hair is removed at the right length and at the right interval, it grows back more predictably — which means fewer surprises between appointments."]'
    ),
    (
        'waxing-vs-shaving',
        'Waxing vs. Shaving: What Actually Changes Over Time',
        'The difference isn''t just how smooth you are on day one — it''s what happens by week three.',
        'Education',
        '4 min read',
        '2026-04-11',
        true,
        '["Shaving cuts hair at the surface, so it grows back with a blunt edge — which is what creates that coarse stubble feeling within a day or two. Waxing removes hair from the root, so regrowth comes in with a natural taper.","Over repeated sessions, many clients notice regrowth becoming finer and sparser, since hair pulled from the root during its growth phase can weaken the follicle over time. Results vary by person and by area.","The trade-off is upfront time and a longer gap between appointments — most areas are rebooked every three to four weeks rather than every few days.","Shaving also tends to cause more irritation over time: razor burn, nicks, and dry skin are common complaints. Waxing, when done properly, exfoliates the skin as it removes hair, leaving a smoother surface that lasts.","That said, shaving has its place — it''s quick, accessible, and works in a pinch. But if you''re looking for longer-lasting smoothness with less daily maintenance, waxing is worth considering."]'
    ),
    (
        'common-waxing-mistakes-to-avoid',
        '8 Common Waxing Mistakes to Avoid',
        'Small mistakes before or after your appointment can affect your results more than you think.',
        'Tips',
        '5 min read',
        '2026-03-15',
        true,
        '["Shaving immediately before an appointment is the most common mistake we see. When hair is too short, the wax can''t grip it properly, leading to patchy results and wasted time. Give yourself at least two weeks of growth before your visit.","Arriving with heavily moisturized or oily skin can also interfere with the wax adhering to the hair. Skip lotions and oils on the treatment area on the day of your appointment.","Exfoliating immediately after waxing is tempting, but freshly waxed skin is sensitive. Wait at least 48 hours before introducing any exfoliation — and start gently.","Wearing tight, friction-heavy clothing right after your appointment can irritate the skin and increase the chance of ingrown hairs. Loose, breathable fabrics are your friend for the rest of the day.","Ignoring aftercare instructions might seem harmless, but the few minutes of care after your appointment make a real difference in how your skin looks and feels in the days that follow.","Picking or touching irritated skin can lead to scarring and infection. If something feels off, apply a cool compress and give it time rather than reaching for it.","Waiting until the last minute to book means you might not get the time slot you want — and you might end up waxing at the wrong length. Book your next appointment before you leave the studio.","And finally, not telling your specialist about relevant skincare products — like retinoids, acne treatments, or bleaching creams — can affect whether waxing is safe for you. Always share what you''re using so we can advise accordingly."]'
    ),
    (
        'what-to-wear-to-waxing-appointment',
        'What Should I Wear to a Waxing Appointment?',
        'Comfort matters more than you think — here''s how to dress for your visit.',
        'Before Your Wax',
        '3 min read',
        '2026-02-28',
        true,
        '["Loose, comfortable clothing is the way to go. Think soft joggers, flowy pants, or a loose dress — anything that won''t press tightly against freshly waxed skin.","For bikini or Brazilian appointments, breathable cotton underwear is ideal. Avoid thongs or synthetic materials for the rest of the day, since they can trap heat and create friction.","Skip the gym clothes on the way home. Compression leggings and sports bras can irritate skin that''s just been waxed, so save your workout for later in the day or the next morning.","If you''re coming during cooler weather, layers work well — you can peel them off if you feel warm after the appointment, and add them back on without discomfort.","The short version: dress like you''re heading to a relaxed afternoon. Comfort wins over fashion for the rest of the day."]'
    ),
    (
        'why-professional-waxing',
        'Why Professional Waxing?',
        'What a trained Cerologist does differently — and why it matters.',
        'Waxing 101',
        '4 min read',
        '2026-02-10',
        true,
        '["Professional technique is the foundation. A trained Cerologist knows how to apply wax at the right temperature, in the right direction, and remove it at the right angle. That precision means less discomfort and cleaner results.","Hygiene standards in a professional studio are non-negotiable. Single-use applicators, sanitized treatment rooms, and proper disposal of used materials are all part of the process — things that are hard to guarantee with at-home kits.","Consistent results come from experience. When someone has performed thousands of appointments, they know how to work with different hair types, skin sensitivities, and body areas. That level of skill can''t be replicated by a wax strip from the drugstore.","Personalized service matters too. Your Cerologist can recommend the right wax formula for your skin, adjust pressure for sensitive areas, and suggest a schedule based on your specific growth cycle.","Proper preparation and aftercare guidance are part of every appointment. We don''t just wax and send you on your way — we make sure you know how to get the best results between visits.","At Waxora, we focus on providing professional waxing services in a clean, welcoming environment where every client can feel comfortable and cared for. That''s not a tagline — it''s the standard we hold ourselves to."]'
    ),
    (
        'how-to-choose-right-waxing-service',
        'How to Choose the Right Waxing Service',
        'Not sure what you need? Here''s a quick guide to help you pick the right treatment.',
        'FAQs & Tips',
        '3 min read',
        '2026-01-25',
        true,
        '["If you want cleaner, more defined eyebrows, start with an Eyebrow Wax. It''s quick, precise, and tailored to your face shape.","For hair removal on the upper lip or chin, an Upper Lip Wax or Chin Wax is fast and effective. Pair them together for a quick facial refresh.","Want smooth underarms that last for weeks? An Underarm Wax removes hair from the root, and regrowth comes back finer over time.","If you''re looking to clean up your bikini line for swimwear, a Bikini Wax handles the edges. For more extensive removal, an Extended Bikini or Brazilian Wax goes further.","For full smoothness on the legs, a Full Leg Wax covers ankle to hip. A Half Leg Wax is a great option if you only need the lower or upper portion.","Not sure where to start? Our Packages bundle the most popular combinations — like Smooth & Simple (underarms, bikini, and half legs) or Face Fresh (eyebrows, upper lip, and chin).","If you''re still unsure, book a consultation or reach out to us. We''ll help you figure out exactly what you need."]'
    ) ON CONFLICT (slug) DO NOTHING;

-- ── Reviews ───────────────────────────────────────────────

INSERT INTO
    reviews (
        customer_name,
        service,
        rating,
        review_text,
        date,
        approved
    )
VALUES (
        'Priya N.',
        'Brazilian Wax',
        5,
        'I put this off for years because I assumed it would be awful. My Cerologist walked me through every step and it was over before I finished being nervous.',
        'August 2026',
        true
    ),
    (
        'Jordan M.',
        'Eyebrow Wax',
        5,
        'First time someone actually shaped my brows to my face instead of just cleaning up a strip down the middle. Been back every four weeks since.',
        'July 2026',
        true
    ),
    (
        'Camille R.',
        'Full Leg Wax',
        5,
        'Booked online in under a minute, was seen within a few days, and the studio itself felt more like a spa than a walk-in place.',
        'July 2026',
        true
    ),
    (
        'Devon A.',
        'Full Face Wax',
        4,
        'Quick, professional, barely any redness afterward. Wish I''d started coming here sooner instead of dealing with at-home kits.',
        'June 2026',
        true
    ),
    (
        'Simone K.',
        'Underarm Wax',
        5,
        'It''s a fifteen-minute appointment that saves me weeks of shaving. The staff remembers my name and my usual, which shouldn''t matter but does.',
        'May 2026',
        true
    ),
    (
        'Aaliyah T.',
        'Smooth & Simple Package',
        5,
        'Clean space, clear pricing, no upsell pressure. They told me honestly when I didn''t need an add-on I''d asked about.',
        'May 2026',
        true
    ) ON CONFLICT DO NOTHING;