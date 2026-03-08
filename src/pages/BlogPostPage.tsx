import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type BlogPost = Tables<"blog_posts">;

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase.from("blog_posts").select("*").eq("slug" as any, slug).eq("published", true).single().then(({ data }) => {
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <section className="section-padding min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </section>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="section-padding min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="font-display text-3xl font-bold">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="section-padding min-h-screen">
        <div className="container mx-auto max-w-3xl">
          <Link to="/blog" className="text-primary hover:underline flex items-center gap-2 mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {post.published_at && (
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                {new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            )}
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">{post.title}</h1>

            {post.excerpt && (
              <p className="text-muted-foreground text-lg mb-8 border-l-2 border-primary pl-4">{post.excerpt}</p>
            )}

            {post.image_url && (
              <div className="rounded-lg overflow-hidden mb-8">
                <img src={post.image_url} alt={post.title} className="w-full h-auto object-cover" />
              </div>
            )}

            {post.content && (
              <div className="prose prose-invert prose-lg max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed">
                {post.content}
              </div>
            )}
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPostPage;
