import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

const events = [
  { title: "SEC Game Day Specials", date: "Every Saturday", time: "12PM – Close", desc: "Half-price wings, $5 draft beers, and big-screen action for every SEC game. Come early to grab a seat!" },
  { title: "Live Music Friday", date: "March 14, 2026", time: "8PM – 11PM", desc: "Enjoy an evening of live R&B and neo-soul with Atlanta's finest local artists." },
  { title: "Hookah & Cocktails Night", date: "Every Thursday", time: "6PM – Close", desc: "Premium hookah flavors paired with our craft cocktail specials. The perfect midweek unwind." },
  { title: "Sunday Brunch", date: "Every Sunday", time: "12PM – 4PM", desc: "Southern brunch favorites with bottomless mimosas and Bloody Marys." },
  { title: "Trivia Tuesday", date: "Every Tuesday", time: "7PM – 9PM", desc: "Test your knowledge and compete for prizes with your crew. Free to play!" },
  { title: "St. Patrick's Day Bash", date: "March 17, 2026", time: "All Day", desc: "Green beer, Irish-inspired specials, and a whole lot of fun. Don't miss the biggest party of the month!" },
];

const EventsPage = () => (
  <Layout>
    <section className="section-padding min-h-screen">
      <div className="container mx-auto">
        <SectionHeading title="Events" subtitle="There's always a reason to come to 404" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              className="bg-card p-6 rounded-lg border border-border hover:border-primary/40 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <h3 className="font-display text-xl font-bold mb-3">{event.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Calendar size={14} className="text-primary" /> {event.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} className="text-primary" /> {event.time}</span>
                <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> 404 Sports Bar</span>
              </div>
              <p className="text-muted-foreground text-sm">{event.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default EventsPage;
