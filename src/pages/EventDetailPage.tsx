import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setEvent(data);
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

  if (!event) {
    return (
      <Layout>
        <section className="section-padding min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="font-display text-3xl font-bold">Event Not Found</h1>
          <Link to="/events" className="text-primary hover:underline">Back to Events</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="section-padding min-h-screen">
        <div className="container mx-auto max-w-3xl">
          <Link to="/events" className="inline-flex items-center gap-1 text-primary hover:underline text-sm mb-6">
            <ArrowLeft size={14} /> Back to Events
          </Link>

          {event.image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            </div>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 text-muted-foreground mb-8">
            <span className="flex items-center gap-1"><Calendar size={16} className="text-primary" /> {event.date}</span>
            {event.time && <span className="flex items-center gap-1"><Clock size={16} className="text-primary" /> {event.time}</span>}
            <span className="flex items-center gap-1"><MapPin size={16} className="text-primary" /> {event.location || "404 Sports Bar"}</span>
          </div>

          {event.description && (
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default EventDetailPage;
