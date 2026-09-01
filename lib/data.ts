export type ServiceCategory = "Face" | "Body" | "Bikini & Intimate" | "Back & Torso" | "Packages";

export type Service = {
  slug: string;
  category: ServiceCategory;
  name: string;
  price: string;
  duration: string;
  short: string;
  description: string;
  includes?: string[];
  prep: string[];
  aftercare: string[];
  popular?: boolean;
};

export const services: Service[] = [
  // ── Face ──────────────────────────────────────────────
  {
    slug: "eyebrow-wax",
    category: "Face",
    name: "Eyebrow Wax",
    price: "KSh 2,200",
    duration: "15 min",
    short: "Professional eyebrow shaping to create a clean, defined brow shape.",
    description:
      "Professional eyebrow waxing to remove unwanted hair and create a clean, defined eyebrow shape. The skin is cleansed, wax is applied to unwanted hair, and the hair is removed from the root. The brows are then cleaned and shaped to create a neat, balanced appearance.",
    includes: ["Hair removal around the eyebrows", "Brow shaping", "Cleaning stray hairs"],
    prep: [
      "Let brows grow for at least 2 weeks since your last shape.",
      "Skip retinol or exfoliating acids on the brow area for 48 hours prior.",
      "Arrive with a rough idea of the shape you like, or trust us to guide you.",
    ],
    aftercare: [
      "Avoid touching or applying makeup to the area for 4 hours.",
      "Skip saunas, steam rooms, and direct sun for 24 hours.",
      "Apply a fragrance-free moisturizer if any tightness appears.",
    ],
    popular: true,
  },
  {
    slug: "upper-lip-wax",
    category: "Face",
    name: "Upper Lip Wax",
    price: "KSh 1,500",
    duration: "10 min",
    short: "Quick and precise removal of unwanted hair from the upper lip area.",
    description:
      "A small amount of wax is applied to the upper lip and removed quickly to take the hair from the root. A fast, low-heat wax designed for the delicate skin on the upper lip.",
    prep: [
      "Avoid sun exposure and tanning for 24 hours before your visit.",
      "Discontinue Retin-A or similar treatments on the area for 5-7 days.",
    ],
    aftercare: [
      "Keep the area clean and avoid exfoliating or applying strong skincare products immediately after treatment.",
      "A cool compress helps if the skin feels warm afterward.",
    ],
  },
  {
    slug: "chin-wax",
    category: "Face",
    name: "Chin Wax",
    price: "KSh 1,500",
    duration: "10 min",
    short: "Removes unwanted facial hair from the chin for a smooth, clean finish.",
    description:
      "Targeted waxing for the chin area to remove unwanted hair from the root. Ideal for maintaining a smooth jawline between appointments.",
    prep: [
      "Let hair grow to at least a quarter inch.",
      "Avoid heavy skincare products on the area for 24 hours before.",
    ],
    aftercare: [
      "Avoid touching the area for a few hours.",
      "Skip direct sun and heat for 24 hours.",
    ],
  },
  {
    slug: "sideburn-wax",
    category: "Face",
    name: "Sideburn Wax",
    price: "KSh 1,800",
    duration: "10 min",
    short: "Removes unwanted hair along the side of the face and sideburn area.",
    description:
      "Hair removal along the side of the face to create a cleaner, more defined facial轮廓. Perfect for clients who want a polished look without the commitment of other methods.",
    prep: [
      "Let hair grow to at least a quarter inch.",
      "Avoid sun exposure for 24 hours before.",
    ],
    aftercare: [
      "Avoid touching the area for a few hours.",
      "Skip makeup on the treated area for 4 hours.",
    ],
  },
  {
    slug: "full-face-wax",
    category: "Face",
    name: "Full Face Wax",
    price: "KSh 4,500",
    duration: "30 min",
    short: "A complete facial waxing treatment for smooth, hair-free skin.",
    description:
      "Everything above the neckline, handled in one visit. Your Cerologist works section by section with our custom wax, which is formulated to grip hair — not skin — so facial waxing stays comfortable even on sensitive areas.",
    includes: ["Forehead", "Eyebrows", "Upper lip", "Chin", "Cheeks", "Sideburn area"],
    prep: [
      "Let hair grow to at least a quarter inch (about 2 weeks).",
      "Pause retinoids and acids for 5-7 days before your appointment.",
    ],
    aftercare: [
      "Avoid direct sun and heat for 24 hours.",
      "Use a fragrance-free SPF daily afterward — freshly waxed skin sunburns faster.",
    ],
    popular: true,
  },
  {
    slug: "nose-wax",
    category: "Face",
    name: "Nose Wax",
    price: "KSh 1,500",
    duration: "10 min",
    short: "Gentle removal of visible unwanted hair around the nostril area.",
    description:
      "A quick and comfortable treatment that removes visible hair from the nostrils. Uses a specialized wax designed for the sensitive nasal area.",
    prep: [
      "Ensure nose area is clean and free of moisturizers.",
      "Blow your nose shortly before the appointment.",
    ],
    aftercare: [
      "Avoid picking or blowing your nose vigorously for a few hours.",
      "Keep the area clean.",
    ],
  },
  {
    slug: "ear-wax",
    category: "Face",
    name: "Ear Wax",
    price: "KSh 1,500",
    duration: "10 min",
    short: "Removal of visible unwanted hair from the outer ear area.",
    description:
      "Professional removal of visible hair from the outer ear. A quick treatment that leaves the ear area looking clean and tidy.",
    prep: [
      "Ensure ear area is clean.",
    ],
    aftercare: [
      "Avoid inserting anything into the ear for a few hours.",
    ],
  },

  // ── Body ──────────────────────────────────────────────
  {
    slug: "underarm-wax",
    category: "Body",
    name: "Underarm Wax",
    price: "KSh 2,500",
    duration: "15 min",
    short: "Smooth results that outlast shaving by weeks, not days.",
    description:
      "A commonly re-booked service once clients feel the difference — regrowth comes back finer and sparser over time, and there's no stubble the next morning. The area is cleansed and prepared before warm wax is applied. The wax is removed quickly, taking the hair from the root.",
    prep: [
      "Hair should be at least a quarter inch long.",
      "Skip deodorant on the morning of your appointment.",
      "Gently exfoliate the day before, not the day of.",
    ],
    aftercare: [
      "Hold off on deodorant and tight clothing for a few hours.",
      "Exfoliate lightly starting 48 hours after your appointment to prevent ingrowns.",
    ],
    popular: true,
  },
  {
    slug: "full-arm-wax",
    category: "Body",
    name: "Full Arm Wax",
    price: "KSh 4,000",
    duration: "30 min",
    short: "Complete hair removal from the arms for smooth, even-looking skin.",
    description:
      "Full coverage waxing from shoulders to wrists. Includes upper arms, forearms, around the elbows, and hands/fingers where appropriate.",
    includes: ["Upper arms", "Forearms", "Around the elbows", "Hands/fingers where appropriate"],
    prep: [
      "Let hair grow for at least 2 weeks.",
      "Moisturize the night before, not the morning of.",
    ],
    aftercare: [
      "Avoid hot showers and tight clothing for 24 hours.",
      "Begin exfoliating after 48 hours to keep skin smooth between visits.",
    ],
  },
  {
    slug: "half-arm-wax",
    category: "Body",
    name: "Half Arm Wax",
    price: "KSh 2,500",
    duration: "20 min",
    short: "Hair removal from either the upper or lower portion of the arm.",
    description:
      "Choose between upper arm or lower arm waxing. A great option if you only need specific areas treated.",
    prep: [
      "Let hair grow for at least 2 weeks.",
      "Moisturize the night before, not the morning of.",
    ],
    aftercare: [
      "Avoid hot showers and tight clothing for 24 hours.",
      "Begin exfoliating after 48 hours.",
    ],
  },
  {
    slug: "full-leg-wax",
    category: "Body",
    name: "Full Leg Wax",
    price: "KSh 6,500",
    duration: "45 min",
    short: "Ankle to hip, done efficiently and evenly.",
    description:
      "Full coverage from ankle to hip using our custom wax, applied and removed in sections to keep the appointment moving without rushing any one area.",
    includes: ["Thighs", "Knees", "Lower legs", "Ankles"],
    prep: [
      "Let hair grow for at least 2 weeks.",
      "Avoid sun exposure or tanning beds for 24 hours prior.",
    ],
    aftercare: [
      "Wear loose clothing home.",
      "Skip hot baths and vigorous exercise for the rest of the day.",
    ],
    popular: true,
  },
  {
    slug: "half-leg-wax",
    category: "Body",
    name: "Half Leg Wax",
    price: "KSh 4,000",
    duration: "30 min",
    short: "Knee-down or knee-up smoothing, your choice.",
    description:
      "A great entry point for first-time leg waxers, or a quick top-up between full-leg appointments. Choose between upper or lower leg.",
    prep: [
      "Let hair grow for at least 2 weeks.",
      "Moisturize the night before, not the morning of.",
    ],
    aftercare: [
      "Avoid hot showers, saunas, and tight leggings for 24 hours.",
      "Begin exfoliating after 48 hours to keep skin smooth between visits.",
    ],
  },
  {
    slug: "full-body-wax",
    category: "Body",
    name: "Full Body Wax",
    price: "KSh 15,000",
    duration: "90 min",
    short: "A comprehensive waxing experience covering multiple areas of the body in one appointment.",
    description:
      "A complete body waxing service covering multiple areas in one session. The exact areas included are confirmed during your consultation so you know exactly what to expect.",
    includes: ["Full legs", "Full arms", "Underarms", "Bikini area", "Back", "Stomach"],
    prep: [
      "Let hair grow for at least 2 weeks across all areas.",
      "Take an over-the-counter pain reliever 30-40 minutes ahead if you're sensitive.",
      "Wear loose, comfortable clothing to your appointment.",
    ],
    aftercare: [
      "Wear loose, breathable clothing for the rest of the day.",
      "Avoid exercise, hot tubs, and swimming pools for 24 hours.",
      "Exfoliate starting 48 hours after to prevent ingrown hairs.",
    ],
  },

  // ── Bikini & Intimate ─────────────────────────────────
  {
    slug: "bikini-wax",
    category: "Bikini & Intimate",
    name: "Bikini Wax",
    price: "KSh 3,500",
    duration: "20 min",
    short: "A clean line just beyond where a swimsuit sits.",
    description:
      "Removes hair that would peek outside standard swimwear, without going further. A comfortable, straightforward option if you're new to bikini waxing.",
    prep: [
      "Hair should be at least a quarter inch long.",
      "Take an over-the-counter pain reliever 30-40 minutes ahead if you're sensitive.",
    ],
    aftercare: [
      "Wear breathable cotton underwear for the rest of the day.",
      "Avoid exercise, hot tubs, and tight clothing for 24 hours.",
    ],
  },
  {
    slug: "extended-bikini-wax",
    category: "Bikini & Intimate",
    name: "Extended Bikini Wax",
    price: "KSh 4,500",
    duration: "25 min",
    short: "A more extensive bikini wax that removes hair further along the bikini line.",
    description:
      "Goes beyond the standard bikini line to remove more hair from a wider area. Ideal for swimsuits or underwear with narrower coverage.",
    prep: [
      "Hair should be at least a quarter inch long.",
      "Take an over-the-counter pain reliever 30-40 minutes ahead if you're sensitive.",
    ],
    aftercare: [
      "Wear breathable cotton underwear for the rest of the day.",
      "Avoid exercise, hot tubs, and tight clothing for 24 hours.",
    ],
  },
  {
    slug: "brazilian-wax",
    category: "Bikini & Intimate",
    name: "Brazilian Wax",
    price: "KSh 5,500",
    duration: "30 min",
    short: "Full removal, front to back, with a Cerologist who's done it thousands of times.",
    description:
      "Our most requested body service. A thorough intimate waxing treatment that removes most or all hair from the front and back intimate areas, according to your preference. Handled with a clear, step-by-step process and constant check-ins, so you always know what's happening next.",
    prep: [
      "Hair should be at least a quarter inch long — trim if it's longer than half an inch.",
      "Take an over-the-counter pain reliever 30-40 minutes ahead if you're sensitive.",
      "Avoid caffeine right before your appointment; it can heighten sensitivity.",
      "Arrive with clean skin.",
    ],
    aftercare: [
      "Wear loose, breathable clothing for the rest of the day.",
      "Avoid exercise, hot tubs, and swimming pools for 24 hours.",
      "Exfoliate starting 48 hours after to prevent ingrown hairs.",
      "Keep the area clean and avoid unnecessary friction.",
    ],
    popular: true,
  },
  {
    slug: "hollywood-wax",
    category: "Bikini & Intimate",
    name: "Hollywood Wax",
    price: "KSh 6,500",
    duration: "40 min",
    short: "A complete intimate waxing treatment that removes all hair from the front and back intimate areas.",
    description:
      "The most thorough intimate waxing service available. All unwanted hair is removed from the front and back intimate areas for a completely smooth result.",
    prep: [
      "Hair should be at least a quarter inch long — trim if it's longer than half an inch.",
      "Take an over-the-counter pain reliever 30-40 minutes ahead if you're sensitive.",
      "Avoid caffeine right before your appointment.",
      "Arrive with clean skin.",
    ],
    aftercare: [
      "Wear loose, breathable clothing for the rest of the day.",
      "Avoid exercise, hot tubs, and swimming pools for 24 hours.",
      "Exfoliate starting 48 hours after to prevent ingrown hairs.",
      "Keep the area clean and avoid unnecessary friction.",
    ],
  },
  {
    slug: "buttocks-wax",
    category: "Bikini & Intimate",
    name: "Buttocks Wax",
    price: "KSh 4,000",
    duration: "20 min",
    short: "Removes unwanted hair from the buttocks area for a smooth finish.",
    description:
      "Professional hair removal from the buttocks area. Performed with care and attention to comfort and hygiene.",
    prep: [
      "Hair should be at least a quarter inch long.",
      "Arrive with clean skin.",
    ],
    aftercare: [
      "Wear loose, breathable clothing.",
      "Avoid sitting on hard surfaces for a few hours.",
      "Keep the area clean.",
    ],
  },

  // ── Back & Torso ──────────────────────────────────────
  {
    slug: "full-back-wax",
    category: "Back & Torso",
    name: "Full Back Wax",
    price: "KSh 5,500",
    duration: "35 min",
    short: "Professional hair removal across the back for smooth, clean-looking skin.",
    description:
      "Complete back waxing from shoulders to lower back. A thorough treatment that leaves the entire back area smooth.",
    includes: ["Upper back", "Mid-back", "Lower back"],
    prep: [
      "Let hair grow for at least 2 weeks.",
      "Exfoliate gently the day before.",
    ],
    aftercare: [
      "Avoid tight clothing for 24 hours.",
      "Begin exfoliating after 48 hours to prevent ingrown hairs.",
    ],
  },
  {
    slug: "chest-wax",
    category: "Back & Torso",
    name: "Chest Wax",
    price: "KSh 4,500",
    duration: "30 min",
    short: "Removes unwanted chest hair for a smoother appearance.",
    description:
      "Professional waxing for the chest area. Removes hair from the root for smooth, long-lasting results.",
    prep: [
      "Let hair grow for at least 2 weeks.",
      "Exfoliate gently the day before.",
    ],
    aftercare: [
      "Avoid tight clothing for 24 hours.",
      "Begin exfoliating after 48 hours.",
    ],
  },
  {
    slug: "stomach-wax",
    category: "Back & Torso",
    name: "Stomach Wax",
    price: "KSh 3,500",
    duration: "20 min",
    short: "Removes unwanted hair from the stomach area.",
    description:
      "Targeted waxing for the stomach area. A quick treatment that removes hair from the root for smooth skin.",
    prep: [
      "Let hair grow for at least 2 weeks.",
    ],
    aftercare: [
      "Avoid tight clothing for 24 hours.",
    ],
  },
  {
    slug: "chest-and-stomach-wax",
    category: "Back & Torso",
    name: "Chest & Stomach Wax",
    price: "KSh 7,000",
    duration: "45 min",
    short: "A combined treatment for a smoother chest and stomach area.",
    description:
      "Full coverage waxing for the entire torso — chest and stomach combined. A comprehensive treatment for clients who want complete smoothness.",
    includes: ["Full chest", "Upper stomach", "Lower stomach"],
    prep: [
      "Let hair grow for at least 2 weeks.",
      "Exfoliate gently the day before.",
    ],
    aftercare: [
      "Avoid tight clothing for 24 hours.",
      "Begin exfoliating after 48 hours.",
    ],
  },

  // ── Packages ──────────────────────────────────────────
  {
    slug: "smooth-and-simple",
    category: "Packages",
    name: "Smooth & Simple",
    price: "KSh 8,000",
    duration: "45 min",
    short: "Underarms, bikini, and half legs — the essentials in one visit.",
    description:
      "Our most popular combination package. Get three essential areas done in one efficient appointment: underarms, bikini, and half legs.",
    includes: ["Underarms", "Bikini", "Half legs"],
    prep: [
      "Let hair grow for at least 2 weeks across all areas.",
      "Take an over-the-counter pain reliever 30-40 minutes ahead if you're sensitive.",
    ],
    aftercare: [
      "Wear loose, breathable clothing for the rest of the day.",
      "Avoid exercise, hot tubs, and tight clothing for 24 hours.",
      "Exfoliate starting 48 hours after to prevent ingrown hairs.",
    ],
    popular: true,
  },
  {
    slug: "full-body-smooth",
    category: "Packages",
    name: "Full Body Smooth",
    price: "KSh 18,000",
    duration: "90 min",
    short: "Full legs, full arms, underarms, and bikini — the complete package.",
    description:
      "Our most comprehensive package for clients who want everything done in one visit. Includes full legs, full arms, underarms, and bikini area.",
    includes: ["Full legs", "Full arms", "Underarms", "Bikini"],
    prep: [
      "Let hair grow for at least 2 weeks across all areas.",
      "Take an over-the-counter pain reliever 30-40 minutes ahead if you're sensitive.",
      "Wear loose, comfortable clothing to your appointment.",
    ],
    aftercare: [
      "Wear loose, breathable clothing for the rest of the day.",
      "Avoid exercise, hot tubs, and swimming pools for 24 hours.",
      "Exfoliate starting 48 hours after to prevent ingrown hairs.",
    ],
  },
  {
    slug: "face-fresh",
    category: "Packages",
    name: "Face Fresh",
    price: "KSh 4,500",
    duration: "25 min",
    short: "Eyebrows, upper lip, and chin — a complete facial waxing session.",
    description:
      "The perfect combination for a fresh, clean face. Includes eyebrow shaping, upper lip, and chin waxing in one quick visit.",
    includes: ["Eyebrows", "Upper lip", "Chin"],
    prep: [
      "Let facial hair grow for at least 2 weeks.",
      "Pause retinoids and acids for 5-7 days before your appointment.",
    ],
    aftercare: [
      "Avoid direct sun and heat for 24 hours.",
      "Use a fragrance-free SPF daily afterward.",
    ],
  },
  {
    slug: "brazilian-care-package",
    category: "Packages",
    name: "Brazilian Care Package",
    price: "KSh 7,500",
    duration: "40 min",
    short: "Brazilian wax plus underarms and aftercare guidance.",
    description:
      "Our Brazilian service combined with underarms and comprehensive aftercare guidance. Perfect for first-timers or clients who want the full intimate waxing experience with expert advice.",
    includes: ["Brazilian", "Underarms", "Aftercare guidance"],
    prep: [
      "Hair should be at least a quarter inch long across all areas.",
      "Take an over-the-counter pain reliever 30-40 minutes ahead if you're sensitive.",
      "Avoid caffeine right before your appointment.",
    ],
    aftercare: [
      "Wear loose, breathable clothing for the rest of the day.",
      "Avoid exercise, hot tubs, and swimming pools for 24 hours.",
      "Exfoliate starting 48 hours after to prevent ingrown hairs.",
      "Follow the personalized aftercare routine provided by your Cerologist.",
    ],
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-long-should-hair-be-before-waxing",
    title: "How Long Should Your Hair Be Before Waxing?",
    excerpt:
      "The single biggest factor in a smooth, low-pain appointment isn't the wax — it's timing your visit right.",
    date: "2026-07-14",
    readTime: "4 min read",
    category: "Preparation",
    body: [
      "Wax needs something to grip. Too short, and it slides right past the hair; too long, and the pull is more uncomfortable than it needs to be. A quarter inch — roughly the length of a grain of rice — is the sweet spot for most areas.",
      "If it's been less than two weeks since your last shave, you're probably not ready. If you shaved recently and have an appointment coming up, it's worth pushing the appointment back rather than showing up early and getting a patchy result.",
      "Hair grows at different rates across your body, so a bikini appointment and a brow appointment won't always line up on the same schedule. Ask your Cerologist during your visit when to expect to be ready for the next one — they'll factor in your specific growth cycle.",
      "Here's a general guideline by area: Eyebrows and upper lip hair tend to be fine and grow quickly, so two weeks is usually enough. Underarm and bikini hair is coarser and may need closer to three weeks. Leg hair varies, but most clients are ready between three and four weeks.",
      "If you're unsure whether you're ready, call or message us before your appointment. We'd rather help you reschedule than have you sit through a session that doesn't give you the best result.",
    ],
  },
  {
    slug: "first-brazilian-what-to-expect",
    title: "Your First Brazilian: What Actually Happens",
    excerpt:
      "No exaggeration, no minimizing — a straightforward walkthrough of what a first appointment looks like.",
    date: "2026-06-02",
    readTime: "6 min read",
    category: "First-Timers",
    body: [
      "You'll start in a private room with your Cerologist, who will ask a few quick questions about your skin, any medications, and what you'd like the end result to look like. This is a good time to mention any sensitivities, allergies, or concerns — there are no awkward questions in this room.",
      "The appointment moves in sections — front, sides, back — with wax applied and removed in short strips. Most clients describe the sensation as a quick pinch rather than ongoing pain, and it becomes more comfortable as the appointment continues.",
      "Your Cerologist will explain each step before it happens. You'll always know what area is being worked on and what to expect. If you need a break at any point, just say so — the pace is always yours.",
      "The whole thing takes about 30 minutes. Most people are surprised at how routine it feels by the end, and how normal talking through the process makes it. There's no reason to arrive extra early or take the day off afterward — most clients go straight back to their day.",
      "After the treatment, your Cerologist will walk you through basic aftercare: wear loose clothing, avoid heat and friction for 24 hours, and start gentle exfoliation after 48 hours to keep ingrowns at bay. That's it — you're done.",
      "For best results, plan to rebook in three to four weeks. Regular waxing tends to make each session quicker and more comfortable as hair grows back finer over time.",
    ],
  },
  {
    slug: "ingrown-hair-prevention",
    title: "Five Habits That Actually Prevent Ingrown Hairs",
    excerpt: "Most ingrown hairs are preventable with a short routine between appointments.",
    date: "2026-05-20",
    readTime: "5 min read",
    category: "Aftercare",
    body: [
      "Ingrown hairs happen when regrowth curls back into the skin instead of pushing through. The two biggest levers you have are exfoliation and loose clothing in the days right after waxing.",
      "Start light exfoliation 48 hours after your appointment — a soft washcloth or a gentle chemical exfoliant, not a harsh scrub right on freshly waxed skin. Keep it up two to three times a week between visits.",
      "Tight clothing traps regrowth against the skin, especially in the bikini area. Cotton underwear and looser pants for the first day make a bigger difference than most people expect.",
      "Moisturize regularly, but skip heavy oils and fragranced lotions for the first 24 hours. After that, a simple, fragrance-free moisturizer keeps skin supple and helps hair push through naturally.",
      "If you do get an ingrown, resist picking at it. A warm compress and consistent gentle exfoliation will usually resolve it faster and with less irritation than trying to extract it yourself.",
      "And finally, stick to your waxing schedule. When hair is removed at the right length and at the right interval, it grows back more predictably — which means fewer surprises between appointments.",
    ],
  },
  {
    slug: "waxing-vs-shaving",
    title: "Waxing vs. Shaving: What Actually Changes Over Time",
    excerpt: "The difference isn't just how smooth you are on day one — it's what happens by week three.",
    date: "2026-04-11",
    readTime: "4 min read",
    category: "Education",
    body: [
      "Shaving cuts hair at the surface, so it grows back with a blunt edge — which is what creates that coarse stubble feeling within a day or two. Waxing removes hair from the root, so regrowth comes in with a natural taper.",
      "Over repeated sessions, many clients notice regrowth becoming finer and sparser, since hair pulled from the root during its growth phase can weaken the follicle over time. Results vary by person and by area.",
      "The trade-off is upfront time and a longer gap between appointments — most areas are rebooked every three to four weeks rather than every few days.",
      "Shaving also tends to cause more irritation over time: razor burn, nicks, and dry skin are common complaints. Waxing, when done properly, exfoliates the skin as it removes hair, leaving a smoother surface that lasts.",
      "That said, shaving has its place — it's quick, accessible, and works in a pinch. But if you're looking for longer-lasting smoothness with less daily maintenance, waxing is worth considering.",
    ],
  },
  {
    slug: "common-waxing-mistakes-to-avoid",
    title: "8 Common Waxing Mistakes to Avoid",
    excerpt: "Small mistakes before or after your appointment can affect your results more than you think.",
    date: "2026-03-15",
    readTime: "5 min read",
    category: "Tips",
    body: [
      "Shaving immediately before an appointment is the most common mistake we see. When hair is too short, the wax can't grip it properly, leading to patchy results and wasted time. Give yourself at least two weeks of growth before your visit.",
      "Arriving with heavily moisturized or oily skin can also interfere with the wax adhering to the hair. Skip lotions and oils on the treatment area on the day of your appointment.",
      "Exfoliating immediately after waxing is tempting, but freshly waxed skin is sensitive. Wait at least 48 hours before introducing any exfoliation — and start gently.",
      "Wearing tight, friction-heavy clothing right after your appointment can irritate the skin and increase the chance of ingrown hairs. Loose, breathable fabrics are your friend for the rest of the day.",
      "Ignoring aftercare instructions might seem harmless, but the few minutes of care after your appointment make a real difference in how your skin looks and feels in the days that follow.",
      "Picking or touching irritated skin can lead to scarring and infection. If something feels off, apply a cool compress and give it time rather than reaching for it.",
      "Waiting until the last minute to book means you might not get the time slot you want — and you might end up waxing at the wrong length. Book your next appointment before you leave the studio.",
      "And finally, not telling your specialist about relevant skincare products — like retinoids, acne treatments, or bleaching creams — can affect whether waxing is safe for you. Always share what you're using so we can advise accordingly.",
    ],
  },
  {
    slug: "what-to-wear-to-waxing-appointment",
    title: "What Should I Wear to a Waxing Appointment?",
    excerpt: "Comfort matters more than you think — here's how to dress for your visit.",
    date: "2026-02-28",
    readTime: "3 min read",
    category: "Before Your Wax",
    body: [
      "Loose, comfortable clothing is the way to go. Think soft joggers, flowy pants, or a loose dress — anything that won't press tightly against freshly waxed skin.",
      "For bikini or Brazilian appointments, breathable cotton underwear is ideal. Avoid thongs or synthetic materials for the rest of the day, since they can trap heat and create friction.",
      "Skip the gym clothes on the way home. Compression leggings and sports bras can irritate skin that's just been waxed, so save your workout for later in the day or the next morning.",
      "If you're coming during cooler weather, layers work well — you can peel them off if you feel warm after the appointment, and add them back on without discomfort.",
      "The short version: dress like you're heading to a relaxed afternoon. Comfort wins over fashion for the rest of the day.",
    ],
  },
  {
    slug: "why-professional-waxing",
    title: "Why Professional Waxing?",
    excerpt: "What a trained Cerologist does differently — and why it matters.",
    date: "2026-02-10",
    readTime: "4 min read",
    category: "Waxing 101",
    body: [
      "Professional technique is the foundation. A trained Cerologist knows how to apply wax at the right temperature, in the right direction, and remove it at the right angle. That precision means less discomfort and cleaner results.",
      "Hygiene standards in a professional studio are non-negotiable. Single-use applicators, sanitized treatment rooms, and proper disposal of used materials are all part of the process — things that are hard to guarantee with at-home kits.",
      "Consistent results come from experience. When someone has performed thousands of appointments, they know how to work with different hair types, skin sensitivities, and body areas. That level of skill can't be replicated by a wax strip from the drugstore.",
      "Personalized service matters too. Your Cerologist can recommend the right wax formula for your skin, adjust pressure for sensitive areas, and suggest a schedule based on your specific growth cycle.",
      "Proper preparation and aftercare guidance are part of every appointment. We don't just wax and send you on your way — we make sure you know how to get the best results between visits.",
      "At Waxora, we focus on providing professional waxing services in a clean, welcoming environment where every client can feel comfortable and cared for. That's not a tagline — it's the standard we hold ourselves to.",
    ],
  },
  {
    slug: "how-to-choose-right-waxing-service",
    title: "How to Choose the Right Waxing Service",
    excerpt: "Not sure what you need? Here's a quick guide to help you pick the right treatment.",
    date: "2026-01-25",
    readTime: "3 min read",
    category: "FAQs & Tips",
    body: [
      "If you want cleaner, more defined eyebrows, start with an Eyebrow Wax. It's quick, precise, and tailored to your face shape.",
      "For hair removal on the upper lip or chin, an Upper Lip Wax or Chin Wax is fast and effective. Pair them together for a quick facial refresh.",
      "Want smooth underarms that last for weeks? An Underarm Wax removes hair from the root, and regrowth comes back finer over time.",
      "If you're looking to clean up your bikini line for swimwear, a Bikini Wax handles the edges. For more extensive removal, an Extended Bikini or Brazilian Wax goes further.",
      "For full smoothness on the legs, a Full Leg Wax covers ankle to hip. A Half Leg Wax is a great option if you only need the lower or upper portion.",
      "Not sure where to start? Our Packages bundle the most popular combinations — like Smooth & Simple (underarms, bikini, and half legs) or Face Fresh (eyebrows, upper lip, and chin).",
      "If you're still unsure, book a consultation or reach out to us. We'll help you figure out exactly what you need.",
    ],
  },
];

export type Review = {
  name: string;
  service: string;
  rating: number;
  quote: string;
  date: string;
};

export const reviews: Review[] = [
  {
    name: "Priya N.",
    service: "Brazilian Wax",
    rating: 5,
    quote:
      "I put this off for years because I assumed it would be awful. My Cerologist walked me through every step and it was over before I finished being nervous.",
    date: "August 2026",
  },
  {
    name: "Jordan M.",
    service: "Eyebrow Wax",
    rating: 5,
    quote:
      "First time someone actually shaped my brows to my face instead of just cleaning up a strip down the middle. Been back every four weeks since.",
    date: "July 2026",
  },
  {
    name: "Camille R.",
    service: "Full Leg Wax",
    rating: 5,
    quote:
      "Booked online in under a minute, was seen within a few days, and the studio itself felt more like a spa than a walk-in place.",
    date: "July 2026",
  },
  {
    name: "Devon A.",
    service: "Full Face Wax",
    rating: 4,
    quote:
      "Quick, professional, barely any redness afterward. Wish I'd started coming here sooner instead of dealing with at-home kits.",
    date: "June 2026",
  },
  {
    name: "Simone K.",
    service: "Underarm Wax",
    rating: 5,
    quote:
      "It's a fifteen-minute appointment that saves me weeks of shaving. The staff remembers my name and my usual, which shouldn't matter but does.",
    date: "May 2026",
  },
  {
    name: "Aaliyah T.",
    service: "Smooth & Simple Package",
    rating: 5,
    quote:
      "Clean space, clear pricing, no upsell pressure. They told me honestly when I didn't need an add-on I'd asked about.",
    date: "May 2026",
  },
];

export type FAQItem = { question: string; answer: string; category: string };

export const faqs: FAQItem[] = [
  {
    category: "Booking",
    question: "How far in advance should I book?",
    answer:
      "Popular time slots — evenings and Saturdays — tend to fill up 5-7 days out. Weekday mornings and early afternoons usually have same-week availability.",
  },
  {
    category: "Booking",
    question: "What's your cancellation policy?",
    answer:
      "We ask for at least 24 hours' notice to cancel or reschedule. Cancellations inside that window may be subject to a fee, which goes to the Cerologist who held that time for you.",
  },
  {
    category: "Preparation",
    question: "How long does my hair need to be?",
    answer:
      "About a quarter inch — roughly two weeks of growth for most areas. Too short and the wax can't grip; too long and the pull is more uncomfortable than necessary. See our blog post on timing for a fuller breakdown by area.",
  },
  {
    category: "Preparation",
    question: "Can I wax while on medication or with sensitive skin?",
    answer:
      "Some medications (retinoids, certain acne treatments, and blood thinners in particular) increase skin sensitivity or thinning, which affects whether waxing is safe. Mention any medications when you book so your Cerologist can advise or suggest an alternative service.",
  },
  {
    category: "During Your Visit",
    question: "Does it hurt?",
    answer:
      "Most clients describe a brief, sharp sensation rather than lasting pain, and it becomes more comfortable as the Cerologist works through an area. First-timers are often surprised by how quick and manageable it is.",
  },
  {
    category: "During Your Visit",
    question: "What should I wear?",
    answer:
      "Loose, comfortable clothing, especially for leg or bikini appointments — you'll want to avoid anything tight going back on right after your service.",
  },
  {
    category: "Aftercare",
    question: "What should I avoid right after waxing?",
    answer:
      "Sun exposure, hot showers or baths, saunas, swimming pools, and vigorous exercise for about 24 hours. Freshly waxed skin is more sensitive to heat and friction than usual.",
  },
  {
    category: "Aftercare",
    question: "How do I prevent ingrown hairs between appointments?",
    answer:
      "Start gentle exfoliation 48 hours after your appointment, two to three times a week, and favor looser clothing for the first day. See our blog for a full routine.",
  },
  {
    category: "Pricing",
    question: "Do prices vary by location?",
    answer:
      "Listed prices are our standard rates and may vary slightly by studio. You'll always see the exact price for your selected studio before confirming a booking.",
  },
];
