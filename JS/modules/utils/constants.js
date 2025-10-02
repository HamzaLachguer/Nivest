/* ============================== */
// Constants & Configs
//
/* ============================== */
export const URL = './productsData.json';

export const TAG_COLORS = {
  new: "bg-blue",
  sale: "bg-red",
  popular: "bg-dark"
}


/* ============================== */
// State
//
/* ============================== */
export let state = {
  favoritesList: new Set(),
  targetDate: new Date("November 1 2025 00:00:00").getTime(),
  interval: null,
  slideIndex: 0,
}


/* ============================== */
// Testimonials
//
/* ============================== */
export const testimonials = [
  {
    review: "These aren’t just sneakers. They’re motivation. I put them on and I move — simple as that. They feel built for momentum, not just comfort. Every step feels like purpose.",
    name: "Marcus Petrov",
    country: "Netherlands",
    imgSrc: "https://framerusercontent.com/images/utC4J2FwNnDujUCNIcD0nEcHNw.png?scale-down-to=512"
  },  {
    review: "Finally found kicks that don’t just look sharp — they actually keep up. On the court, in the city, wherever. I’ve put them through heat, rain, and long days. Never missed a beat in entire life.",
    name: "Alina Reyes",
    country: "Spain",
    imgSrc: "https://framerusercontent.com/images/696Q9tY9SbzS5TpEg234BbCxXVQ.png?scale-down-to=512"
  },  {
    review: "Comfort? Check. Grip? Solid. Style? You already know. I’ve worn them daily and they still feel brand new. These shoes aren’t just part of my outfit — they’re part of my rhythm.",
    name: "Jamal Okoro",
    country: "England",
    imgSrc: "https://framerusercontent.com/images/aLQJz65d0ZahdyQjRJ7fH3ogNKY.png?scale-down-to=512"
  }
];


/* ============================== */
// FAQ list
//
/* ============================== */
export const FAQList = [
  {
    question: "What’s your return policy?",
    answer: "No stress. You’ve got 30 days to send them back — worn inside only, clean, and in original condition."
  },
  {
    question: "How long does shipping take?",
    answer: "Most orders ship in 1–2 days. Delivery hits your door within 3–7, depending on your zone."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes — global hustle, global reach. Shipping times vary based on location."
  },
  {
    question: "What if I ordered the wrong size?",
    answer: "Swap it fast, no questions. Use the return portal and grab the size that fits your stride."
  },
  {
    question: "Are your shoes true to size?",
    answer: "Yes — built to match standard fit. Wide feet? Size up half. Still unsure? Check our size guide."
  },
]


/* ============================== */
// Social media posts
//
/* ============================== */
export const socialMediaPosts = [
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/Un1nDdOiuQM2UcVDJO9DeOsAhw.png",
  },
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/NcSd7d619YqUizwo5PL6ocKBLbo.png",
  },
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/ADK5HmWPOgvzSZh2XUc7GJwDQMY.png",
  },
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/Un1nDdOiuQM2UcVDJO9DeOsAhw.png",
  },
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/NcSd7d619YqUizwo5PL6ocKBLbo.png",
  },
  {
    tag: "Follow @nivest on Instagram",
    imgSrc: "https://framerusercontent.com/images/ADK5HmWPOgvzSZh2XUc7GJwDQMY.png",
  },
]