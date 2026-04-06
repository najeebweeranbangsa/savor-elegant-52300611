import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const EventsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    supabase.from("events").select("*").order("date", { ascending: true }).then(({ data }) => {
      const all = data || [];
      // Events with parseable dates get split; recurring/text dates stay in upcoming
      const upcoming: Event[] = [];
      const past: Event[] = [];
      all.forEach((event) => {
        const parsed = Date.parse(event.date);
        if (!isNaN(parsed) && event.date <= today) {
          past.push(event);
        } else {
          upcoming.push(event);
        }
      });
      setUpcomingEvents(upcoming);
      setPastEvents(past.reverse());
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

  const EventCard = ({ event, index }: { event: Event; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        to={`/events/${event.slug}`}
        className="block bg-card rounded-lg border border-border hover:border-primary/40 transition-colors overflow-hidden"
      >
        {event.image_url && (
          <div className="aspect-video w-full overflow-hidden">
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6">
          <h3 className="font-display text-xl font-bold mb-3">{event.title}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1"><Calendar size={14} className="text-primary" /> {event.date}</span>
            {event.time && <span className="flex items-center gap-1"><Clock size={14} className="text-primary" /> {event.time}</span>}
            <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {event.location || "404 Sports Bar"}</span>
          </div>
          {event.description && <p className="text-muted-foreground text-sm line-clamp-3">{event.description}</p>}
        </div>
      </Link>
    </motion.div>
  );

  return (
    <Layout>
      <section className="section-padding min-h-screen">
        <div className="container mx-auto">
          <SectionHeading title="Events" subtitle="There's always a reason to come to 404" />
          {upcomingEvents.length === 0 && pastEvents.length === 0 ? (
            <p className="text-center text-muted-foreground">No events scheduled yet. Check back soon!</p>
          ) : (
            <>
              {upcomingEvents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {upcomingEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))}
                </div>
              )}
              {pastEvents.length > 0 && (
                <div className="max-w-5xl mx-auto mt-12">
                  <h2 className="font-display text-2xl font-bold mb-6 text-muted-foreground">Past Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70">
                    {pastEvents.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EventsPage;
