import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("events").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setEvents(data || []);
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
          <SectionHeading title="Events" subtitle="There's always a reason to come to 404" />
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground">No events scheduled yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  className="bg-card p-6 rounded-lg border border-border hover:border-primary/40 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <h3 className="font-display text-xl font-bold mb-3">{event.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} className="text-primary" /> {event.date}</span>
                    {event.time && <span className="flex items-center gap-1"><Clock size={14} className="text-primary" /> {event.time}</span>}
                    <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {event.location || "404 Sports Bar"}</span>
                  </div>
                  {event.description && <p className="text-muted-foreground text-sm">{event.description}</p>}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EventsPage;
