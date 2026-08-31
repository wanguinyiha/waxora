export type Service = {
  slug: string;
  category: "Face" | "Body" | "Brows";
  name: string;
  price: string;
  duration: string;
  short: string;
  description: string;
  prep: string[];
  aftercare: string[];
  popular?: boolean;
};

export const services: Service[] = [
  {
    slug: "brow-shaping",
    category: "Brows",
    name: "Brow Shaping",
    price: "$22",
    duration: "15 min",
    short: "A clean, face-framing shape tailored to your natural line.",
    description:
      "Our most-booked service. A Cerologist maps your brow to your bone structure before a single strip goes down, so the shape works with your face rather than a generic template. Finished with tinted balm to calm the skin.",
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
    slug: "lip-and-chin",
    category: "Face",
    name: "Lip & Chin",
    price: "$18",
    duration: "10 min",
    short: "Fast, precise removal for fine facial hair.",
    description:
      "A quick, low-heat wax designed for the more delicate skin on the lip and chin. Ideal to pair with a brow appointment for a full-face refresh in under half an hour.",
    prep: [
      "Avoid sun exposure and tanning for 24 hours before your visit.",
      "Discontinue Retin-A or similar treatments on the area for 5-7 days.",
    ],
    aftercare: [
      "No hot water, sun, or makeup on the area for a few hours.",
      "A cool compress helps if the skin feels warm afterward.",
    ],
  },
  {
    slug: "full-face",
    category: "Face",
    name: "Full Face",
    price: "$45",
    duration: "30 min",
    short: "Brows, lip, chin, and cheeks in one smoothing session.",
    description:
      "Everything above the neckline, handled in one visit. Your Cerologist works section by section with our custom wax, which is formulated to grip hair — not skin — so facial waxing stays comfortable even on sensitive areas.",
    prep: [
      "Let hair grow to at least a quarter inch (about 2 weeks).",
      "Pause retinoids and acids for 5-7 days before your appointment.",
    ],
    aftercare: [
      "Avoid direct sun and heat for 24 hours.",
      "Use a fragrance-free SPF daily afterward — freshly waxed skin sunburns faster.",
    ],
  },
  {
    slug: "underarm",
    category: "Body",
    name: "Underarm",
    price: "$25",
    duration: "15 min",
    short: "Smooth results that outlast shaving by weeks, not days.",
    description:
      "A commonly re-booked service once clients feel the difference — regrowth comes back finer and sparser over time, and there's no stubble the next morning.",
    prep: [
      "Hair should be at least a quarter inch long.",
      "Skip deodorant on the morning of your appointment.",
      "Gently exfoliate the day before, not the day of.",
    ],
    aftercare: [
      "Hold off on deodorant and tight clothing for a few hours.",
      "Exfoliate lightly starting 48 hours after your appointment to prevent ingrowns.",
    ],
  },
  {
    slug: "half-leg",
    category: "Body",
    name: "Half Leg",
    price: "$40",
    duration: "30 min",
    short: "Knee-down or knee-up smoothing, your choice.",
    description:
      "A great entry point for first-time leg waxers, or a quick top-up between full-leg appointments. Ask your Cerologist about combining with a Bikini service to save a return trip.",
    prep: [
      "Let hair grow for at least 2 weeks.",
      "Moisturize the night before, not the morning of.",
    ],
    aftercare: [
      "Avoid hot showers, saunas, and tight leggings for 24 hours.",
      "Begin exfoliating after 48 hours to keep skin smooth between visits.",
    ],
    popular: true,
  },
  {
    slug: "full-leg",
    category: "Body",
    name: "Full Leg",
    price: "$65",
    duration: "45 min",
    short: "Ankle to hip, done efficiently and evenly.",
    description:
      "Full coverage from ankle to hip using our custom wax, applied and removed in sections to keep the appointment moving without rushing any one area.",
    prep: [
      "Let hair grow for at least 2 weeks.",
      "Avoid sun exposure or tanning beds for 24 hours prior.",
    ],
    aftercare: [
      "Wear loose clothing home.",
      "Skip hot baths and vigorous exercise for the rest of the day.",
    ],
  },
  {
    slug: "bikini",
    category: "Body",
    name: "Bikini",
    price: "$35",
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
    slug: "brazilian",
    category: "Body",
    name: "Brazilian",
    price: "$55",
    duration: "30 min",
    short: "Full removal, front to back, with a Cerologist who's done it thousands of times.",
    description:
      "Our most requested body service. Handled with a clear, step-by-step process and constant check-ins, so you always know what's happening next. Most first-timers say it's far more comfortable than they expected.",
    prep: [
      "Hair should be at least a quarter inch long — trim if it's longer than half an inch.",
      "Take an over-the-counter pain reliever 30-40 minutes ahead if you're sensitive.",
      "Avoid caffeine right before your appointment; it can heighten sensitivity.",
    ],
    aftercare: [
      "Wear loose, breathable clothing for the rest of the day.",
      "Avoid exercise, hot tubs, and swimming pools for 24 hours.",
      "Exfoliate starting 48 hours after to prevent ingrown hairs.",
    ],
    popular: true,
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
      "Curious hair grows at different rates across your body, so a bikini appointment and a brow appointment won't always line up on the same schedule. Ask your Cerologist during your visit when to expect to be ready for the next one — they'll factor in your specific growth cycle.",
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
      "You'll start in a private room with your Cerologist, who will ask a few quick questions about your skin, any medications, and what you'd like the end result to look like.",
      "The appointment moves in sections — front, sides, back — with wax applied and removed in short strips. Most clients describe the sensation as a quick pinch rather than ongoing pain, and it becomes more comfortable as the appointment continues.",
      "The whole thing takes about 30 minutes. Most people are surprised at how routine it feels by the end, and how normal talking through the process makes it. There's no reason to arrive extra early or take the day off afterward — most clients go straight back to their day.",
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
      "If you do get an ingrown, resist picking at it. A warm compress and consistent gentle exfoliation will usually resolve it faster and with less irritation than trying to extract it yourself.",
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
    service: "Brazilian",
    rating: 5,
    quote:
      "I put this off for years because I assumed it would be awful. My Cerologist walked me through every step and it was over before I finished being nervous.",
    date: "August 2026",
  },
  {
    name: "Jordan M.",
    service: "Brow Shaping",
    rating: 5,
    quote:
      "First time someone actually shaped my brows to my face instead of just cleaning up a strip down the middle. Been back every four weeks since.",
    date: "July 2026",
  },
  {
    name: "Camille R.",
    service: "Full Leg",
    rating: 5,
    quote:
      "Booked online in under a minute, was seen within a few days, and the studio itself felt more like a spa than a walk-in place.",
    date: "July 2026",
  },
  {
    name: "Devon A.",
    service: "Full Face",
    rating: 4,
    quote:
      "Quick, professional, barely any redness afterward. Wish I'd started coming here sooner instead of dealing with at-home kits.",
    date: "June 2026",
  },
  {
    name: "Simone K.",
    service: "Underarm",
    rating: 5,
    quote:
      "It's a fifteen-minute appointment that saves me weeks of shaving. The staff remembers my name and my usual, which shouldn't matter but does.",
    date: "May 2026",
  },
  {
    name: "Aaliyah T.",
    service: "Bikini",
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
