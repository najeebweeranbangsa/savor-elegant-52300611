import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Category = Tables<"menu_categories">;
type MenuItem = Tables<"menu_items">;

const MenuPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const showAll = activeCategory === "all";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [c, i] = await Promise.all([
        (supabase.from("menu_categories").select("*") as any).eq("archived", false).order("sort_order"),
        (supabase.from("menu_items").select("*") as any).eq("archived", false).order("sort_order"),
      ]);
      setCategories(c.data || []);
      setItems(i.data || []);
      setActiveCategory("all");
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredItems = showAll ? items : items.filter((i) => i.category_id === activeCategory);
  const activeCatName = showAll ? "Full Menu" : categories.find((c) => c.id === activeCategory)?.name;

  if (loading) {
    return (
      <Layout>
        <section className="section-padding min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </section>
      </Layout>
    );
  }

  if (categories.length === 0) {
    return (
      <Layout>
        <section className="section-padding min-h-screen">
          <div className="container mx-auto">
            <SectionHeading title="Our Menu" subtitle="Menu coming soon!" />
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding min-h-screen">
        <div className="container mx-auto">
          <SectionHeading title="Our Menu" subtitle="From Southern comfort food to craft cocktails, we've got it all" />

          <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl mx-auto">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                showAll
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              View All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  !showAll && activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            {showAll ? (
              <div className="space-y-12">
                {categories.map((cat) => {
                  const catItems = items.filter((i) => i.category_id === cat.id);
                  if (catItems.length === 0) return null;
                  return (
                    <div key={cat.id}>
                      <h3 className="font-display text-2xl font-bold text-primary mb-6 uppercase">{cat.name}</h3>
                      <div className="space-y-4">
                        {catItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-start gap-4 border-b border-border pb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{item.name}</h4>
                              {item.description && <p className="text-muted-foreground text-sm mt-0.5">{item.description}</p>}
                            </div>
                            <span className="text-primary font-bold whitespace-nowrap">${Number(item.price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl font-bold text-primary mb-6 uppercase">{activeCatName}</h3>
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-4 border-b border-border pb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        {item.description && <p className="text-muted-foreground text-sm mt-0.5">{item.description}</p>}
                      </div>
                      <span className="text-primary font-bold whitespace-nowrap">${Number(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                  {filteredItems.length === 0 && <p className="text-muted-foreground">No items in this category yet.</p>}
                </div>
              </>
            )}
          </motion.div>

          {/* Allergy Warning */}
          <div className="max-w-3xl mx-auto mt-14 p-6 rounded-lg border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={20} className="text-primary" />
              <h3 className="font-display text-lg font-bold uppercase text-primary">Allergy Warning</h3>
            </div>
            <p className="text-foreground/90 text-sm leading-relaxed mb-3">
              <strong>Food Allergy Notice:</strong> Our kitchen prepares menu items that may contain or come into contact with the 9 major food allergens: Milk, Eggs, Fish, Shellfish, Tree Nuts, Peanuts, Wheat, Soy, and Sesame.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If you have a food allergy, please notify your server before ordering so we can assist you in selecting the safest dining options.
            </p>
          </div>

          {/* About Info */}
          <div className="max-w-3xl mx-auto mt-10 text-center space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Located minutes from Southlake Mall, 404 Sports Bar & Grill is your home for the best wings, nightlife, and food in Morrow. Explore our menu, <Link to="/order" className="text-primary hover:underline">order ahead</Link> through online ordering, or read the latest stories and updates on our <Link to="/blog" className="text-primary hover:underline">blog</Link>.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Planning a night out or special event? <Link to="/reservation" className="text-primary hover:underline">Reserve your space</Link> at 404, book group meals through <Link to="/catering" className="text-primary hover:underline">catering</Link>, and see everything happening this week on our <Link to="/events" className="text-primary hover:underline">events page</Link>.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MenuPage;
