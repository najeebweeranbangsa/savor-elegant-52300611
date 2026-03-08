import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";

const menuData = {
  Shareables: [
    { name: "Southwest Eggrolls", price: "$10.99", desc: "Crispy rolls filled with chicken, black beans, corn, peppers & southwest spices" },
    { name: "Shrimp Spring Rolls", price: "$9.99", desc: "Fresh shrimp wrapped with veggies in a light rice paper" },
    { name: "Fried Mushrooms", price: "$9.00", desc: "Beer-battered cremini mushrooms, golden fried & served with ranch" },
    { name: "Tender Basket", price: "$10.99", desc: "Crispy chicken tenders served with your choice of dipping sauce" },
    { name: "Blue Crab Fingers", price: "$15.99", desc: "Deep-fried blue crab fingers with cocktail sauce" },
    { name: "Wings", price: "$12.99", desc: "Jumbo wings tossed in your choice of our signature sauces" },
    { name: "Spinach Artichoke Dip", price: "$11.99", desc: "Creamy spinach and artichoke dip served with tortilla chips" },
    { name: "Loaded Cheese Fries", price: "$8.99", desc: "Seasoned fries topped with melted cheese, bacon & green onions" },
  ],
  Burgers: [
    { name: "Black & Bleu Burger", price: "$15.99", desc: "Angus beef, bleu cheese crumbles, caramelized onions & arugula" },
    { name: "Hand-Breaded Chicken Sandwich", price: "$12.99", desc: "Crispy chicken breast with pickles, slaw & spicy mayo" },
    { name: "Impossible Burger", price: "$15.99", desc: "Plant-based patty with all the classic fixings" },
    { name: "Cheeseburger", price: "$17.99", desc: "Classic angus patty with American cheese, lettuce, tomato & onion" },
    { name: "Bacon Burger", price: "$17.99", desc: "Thick-cut bacon, cheddar, lettuce, onion rings & BBQ drizzle" },
  ],
  "Seafood & Sandwiches": [
    { name: "Crab Cake", price: "$15.99", desc: "Lump crab cake pan-seared golden, served with remoulade" },
    { name: "Jumbo Shrimp", price: "$15.99", desc: "Grilled or fried jumbo shrimp with cocktail sauce" },
    { name: "Salmon Bites", price: "$14.99", desc: "Seasoned salmon pieces, pan-seared with herbs" },
    { name: "Catfish Sandwich", price: "$13.99", desc: "Southern fried catfish fillet on a toasted bun" },
    { name: "Land & Sea Burger", price: "$15.00", desc: "Angus patty topped with grilled shrimp & crab" },
    { name: "Shrimp Po'Boy", price: "$15.99", desc: "Crispy fried shrimp on French bread with lettuce & remoulade" },
  ],
  Salads: [
    { name: "House Salad", price: "$6.99", desc: "Mixed greens, tomatoes, cucumber & croutons" },
    { name: "Cobb Salad", price: "$12.99", desc: "Grilled chicken, bacon, egg, avocado, bleu cheese & tomato" },
    { name: "Caesar Salad", price: "$8.99", desc: "Romaine, parmesan, croutons & classic Caesar dressing" },
  ],
  Entrées: [
    { name: "Pasta Alfredo", price: "$15.99", desc: "Creamy fettuccine with garlic parmesan sauce" },
    { name: "Lobster Tail", price: "$37.99", desc: "Broiled cold water lobster tail with drawn butter" },
    { name: "Chicken & Shrimp Carbonara", price: "$21.99", desc: "Rich carbonara sauce with grilled chicken & sautéed shrimp" },
    { name: "Lamb Chops", price: "$37.99", desc: "Herb-crusted lamb chops with garlic butter & mint jelly" },
    { name: "Catfish Dinner", price: "$24.99", desc: "Southern fried catfish served with fries & coleslaw" },
  ],
  Cocktails: [
    { name: "404 Margarita", price: "$13.99", desc: "Our signature margarita with premium tequila & fresh lime" },
    { name: "Knock-Out Punch", price: "$11.99", desc: "Tropical house punch with rum, fruit juices & grenadine" },
    { name: "The Cover Two (Smoked Old Fashioned)", price: "$15.00", desc: "Bourbon, smoked cherry, bitters & orange peel" },
    { name: "Southside Mule", price: "$15.99", desc: "Vodka, ginger beer, lime & fresh mint" },
    { name: "The Blitz Martini", price: "$15.99", desc: "Bourbon lemonade martini shaken with fresh citrus" },
  ],
  Desserts: [
    { name: "Funnel Fries", price: "$7.99", desc: "Crispy funnel cake strips dusted with powdered sugar" },
    { name: "Chocolate Molten", price: "$9.99", desc: "Warm chocolate lava cake with vanilla ice cream" },
    { name: "NY Cheesecake", price: "$11.99", desc: "Classic New York style cheesecake with berry compote" },
  ],
};

const categories = Object.keys(menuData);

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <Layout>
      <section className="section-padding min-h-screen">
        <div className="container mx-auto">
          <SectionHeading title="Our Menu" subtitle="From Southern comfort food to craft cocktails — we've got it all" />

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu items */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <h3 className="font-display text-2xl font-bold text-primary mb-6 uppercase">{activeCategory}</h3>
            <div className="space-y-4">
              {(menuData as Record<string, Array<{ name: string; price: string; desc: string }>>)[activeCategory].map((item) => (
                <div key={item.name} className="flex justify-between items-start gap-4 border-b border-border pb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                    <p className="text-muted-foreground text-sm mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-primary font-bold whitespace-nowrap">{item.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MenuPage;
