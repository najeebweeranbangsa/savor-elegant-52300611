import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [c, i] = await Promise.all([
        supabase.from("menu_categories").select("*").order("sort_order"),
        supabase.from("menu_items").select("*").order("sort_order"),
      ]);
      setCategories(c.data || []);
      setItems(i.data || []);
      if (c.data && c.data.length > 0) setActiveCategory(c.data[0].id);
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredItems = items.filter((i) => i.category_id === activeCategory);
  const activeCatName = categories.find((c) => c.id === activeCategory)?.name;

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
          <SectionHeading title="Our Menu" subtitle="From Southern comfort food to craft cocktails — we've got it all" />

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
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
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MenuPage;
