import { faqs } from "../db/schema/faqs";
import { db } from "../index";

export const seedFaqs = async () => {
  console.log("🌱 Seeding 15 FAQs...");

  const faqData = [
    // --- Kategori: Services & Process ---
    {
      category: "Services & Process",
      question: "What kind of projects do you typically take on?",
      answer:
        "I handle a wide range of projects, from simple landing pages and personal portfolios to complex SaaS platforms and enterprise-level web applications.",
    },
    {
      category: "Services & Process",
      question: "Do you handle UI/UX design as well?",
      answer:
        "Yes, I provide end-to-end services. I can start from wireframing and high-fidelity design in Figma before moving to the development phase.",
    },
    {
      category: "Services & Process",
      question: "What is your typical project workflow?",
      answer:
        "My process usually involves four stages: Discovery (planning), Design (UI/UX), Development (coding), and Deployment (launching & testing).",
    },
    {
      category: "Services & Process",
      question: "How do you handle project communication?",
      answer:
        "I prefer using Slack, Discord, or Email for daily updates, and scheduled Zoom or Google Meet calls for weekly progress demonstrations.",
    },
    {
      category: "Services & Process",
      question: "Can you help with website maintenance after launch?",
      answer:
        "Absolutely. I offer maintenance packages to ensure your website stays secure, up-to-date, and performs optimally long after the initial launch.",
    },

    // --- Kategori: Technical ---
    {
      category: "Technical",
      question: "Why do you use Nuxt 3 and Vue for development?",
      answer:
        "Nuxt 3 provides excellent performance, great SEO capabilities out of the box, and a superior developer experience, which results in faster delivery for clients.",
    },
    {
      category: "Technical",
      question: "Is my website going to be mobile-friendly?",
      answer:
        "Yes, every website I build is 'Mobile First' and fully responsive, meaning it will look and function perfectly on smartphones, tablets, and desktops.",
    },
    {
      category: "Technical",
      question: "How do you ensure the website is fast and optimized?",
      answer:
        "I use modern techniques like Image Optimization, Lazy Loading, Edge Caching with Turso, and minimal third-party scripts to achieve high Lighthouse scores.",
    },
    {
      category: "Technical",
      question: "Do you provide SEO services?",
      answer:
        "I implement technical SEO on every project, including semantic HTML, meta tags, sitemaps, and structured data to help your site rank better on Google.",
    },
    {
      category: "Technical",
      question: "Can you integrate third-party APIs or tools?",
      answer:
        "Yes, I have extensive experience integrating payment gateways (Stripe/Midtrans), CMS tools, Analytics, and various other third-party REST or GraphQL APIs.",
    },

    // --- Kategori: Pricing & Collaboration ---
    {
      category: "Pricing & Collaboration",
      question: "How do you determine the cost of a project?",
      answer:
        "Pricing is based on the project's scope, complexity, and estimated timeline. I can provide either a fixed-price quote or an hourly rate depending on your preference.",
    },
    {
      category: "Pricing & Collaboration",
      question: "Do I need to pay an upfront deposit?",
      answer:
        "Typically, I require a 50% upfront deposit to secure the slot in my schedule, with the remaining balance due upon project completion.",
    },
    {
      category: "Pricing & Collaboration",
      question: "Are you available for long-term contract work?",
      answer:
        "Yes, I am open to long-term collaborations or part-time retainer agreements if you need ongoing development support for your team.",
    },
    {
      category: "Pricing & Collaboration",
      question: "Do you work with clients internationally?",
      answer:
        "Yes, I have worked with clients from various time zones. I am flexible with my working hours to ensure we have sufficient overlap for meetings.",
    },
    {
      category: "Pricing & Collaboration",
      question: "What information do I need to provide to get started?",
      answer:
        "To get a precise quote, I'll need a project brief, any existing design assets, a list of required features, and your target deadline.",
    },
  ];

  try {
    await db.insert(faqs).values(faqData);
    console.log("✅ 15 FAQs successfully seeded in 3 categories!");
  } catch (error) {
    console.error("❌ Error seeding FAQs:", error);
    throw error;
  }
};
