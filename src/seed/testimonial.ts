import { testimonials } from "../db/schema/testimonials";
import { db } from "../index";

export const seedTestimonials = async () => {
  console.log("🌱 Seeding testimonials...");

  const testimonialData = [
    {
      authorName: "Sarah Jenkins",
      authorRole: "CEO",
      authorCompany: "TechFlow Solutions",
      content:
        "Working with this developer was a game-changer for our platform. The attention to detail in the Nuxt implementation and the speed of the final product exceeded our expectations.",
      avatarUrl: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      authorName: "Michael Chen",
      authorRole: "Product Manager",
      authorCompany: "Creative Pulse",
      content:
        "A truly professional experience. Not only is the code clean and maintainable, but the UI/UX insights provided during the development phase added immense value to the project.",
      avatarUrl: "https://i.pravatar.cc/150?u=michael",
    },
    {
      authorName: "Emma Rodriguez",
      authorRole: "Founder",
      authorCompany: "EduStack",
      content:
        "The best full-stack developer we've hired. Communication was seamless, and the ability to solve complex backend logic while keeping the frontend performant is rare to find.",
      avatarUrl: "https://i.pravatar.cc/150?u=emma",
    },
    {
      authorName: "David Kim",
      authorRole: "Lead Developer",
      authorCompany: "Global Systems",
      content:
        "The migration to Nuxt 3 and Turso was handled flawlessly. Our lighthouse scores jumped to 99+, and the developer's knowledge of edge computing is top-notch.",
      avatarUrl: "https://i.pravatar.cc/150?u=david",
    },
    {
      authorName: "Jessica Wong",
      authorRole: "Marketing Director",
      authorCompany: "Lumina Brand",
      content:
        "Our landing page conversion increased by 40% after the redesign. The integration of high-performance animations and fast loading times made a huge difference.",
      avatarUrl: "https://i.pravatar.cc/150?u=jessica",
    },
  ];

  try {
    // Jalankan insert
    await db.insert(testimonials).values(testimonialData);
    console.log("✅ 5 Testimonials successfully seeded!");
  } catch (error) {
    console.error("❌ Error seeding testimonials:", error);
    throw error;
  }
};
