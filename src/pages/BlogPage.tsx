import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type BlogPost = Tables<"blog_posts">;

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false }).then(({ data }) => {
      setPosts(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Layout>
        <section className="section-padding min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding min-h-screen">
        <div className="container mx-auto">
          <SectionHeading title="Blog" subtitle="News, stories & recipes from the 404 family" />
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  className="bg-card rounded-lg overflow-hidden border border-border group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5">
                    {post.published_at && (
                      <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                        {new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    )}
                    <h3 className="font-display text-xl font-semibold mt-2 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-muted-foreground text-sm">{post.excerpt}</p>}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
