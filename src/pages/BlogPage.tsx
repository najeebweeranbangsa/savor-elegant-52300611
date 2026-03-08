import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import dishBurger from "@/assets/dish-burger.jpg";
import dishWings from "@/assets/dish-wings.jpg";
import dishCocktail from "@/assets/dish-cocktail.jpg";

const posts = [
  {
    title: "Game Day Specials You Can't Miss This Season",
    excerpt: "From half-price wings to bucket specials, here's your guide to the best deals at 404 every game day.",
    date: "March 5, 2026",
    image: dishWings,
  },
  {
    title: "Behind the Bar: Crafting the Perfect 404 Margarita",
    excerpt: "Our bartender shares the secrets behind our most-ordered cocktail and tips for making it at home.",
    date: "February 20, 2026",
    image: dishCocktail,
  },
  {
    title: "The Story Behind Our Famous Loaded Burger",
    excerpt: "How our chef created the signature burger that keeps guests coming back week after week.",
    date: "February 10, 2026",
    image: dishBurger,
  },
];

const BlogPage = () => (
  <Layout>
    <section className="section-padding min-h-screen">
      <div className="container mx-auto">
        <SectionHeading title="Blog" subtitle="News, stories & recipes from the 404 family" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              className="bg-card rounded-lg overflow-hidden border border-border group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="aspect-video overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5">
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">{post.date}</span>
                <h3 className="font-display text-xl font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-muted-foreground text-sm">{post.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default BlogPage;
