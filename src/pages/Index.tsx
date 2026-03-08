import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Calendar, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import heroBg from "@/assets/bar-interior.jpg";
import logo from "@/assets/logo-full.png";
import dishBurger from "@/assets/bison-burger.jpeg";
import dishWings from "@/assets/wings.jpeg";
import dishCocktail from "@/assets/funnel-fries.jpeg";
import dishSeafood from "@/assets/crab-claws.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const featuredDishes = [
  { name: "Loaded Burger", desc: "Double patty with bacon, cheddar, onion rings & our signature sauce", price: "$17.99", image: dishBurger },
  { name: "Crispy Wings", desc: "Tossed in your choice of 404 signature sauces", price: "$12.99", image: dishWings },
  { name: "Crab Claws", desc: "Crispy fried crab claws with signature seasoning", price: "$16.99", image: dishSeafood },
  { name: "Funnel Fries", desc: "Crispy funnel cake fries dusted with powdered sugar", price: "$8.99", image: dishCocktail },
];

const testimonials = [
  { name: "Jennel", text: "I love, love, love, the crab claws that they serve here. The atmosphere is chill, good vibes, the service is awesome. If you're looking for a down to earth spot near Southlake mall, 404 Sports Bar & Grill is the place to be.", rating: 5 },
  { name: "Pri B", text: "Love the music and the food MADE FROM SCRATCH PERIOD. U gotta try the pasta... Love the crab cake burger and its sauce. The Dusse margaritas fire... great vibes nice stay.", rating: 5 },
  { name: "Angel Michelle", text: "Sat at the bar with Krystal and she was quick, knowledgeable, and kind. Lots of tvs to watch games/events, and they did have a dj. Prices and portions were fair. I'd certainly recommend this place.", rating: 5 },
  { name: "Juicey Moore", text: "I love the atmosphere. The DJ, THE SERVERS, and the atmospheric was very nice. This is a must try place you'd definitely love the vibes here.", rating: 5 },
  { name: "Cortez J", text: "The restaurant was clean, the set up was nice & they have nice art on the walls. The food & drinks were good. They have tv's around the restaurant for you to watch sports. Outdoor seating is available & parking is free.", rating: 5 },
  { name: "Zipporah Ford", text: "The drinks, hookah, and food was a 10/10! I had mild wings and a catfish sandwich & the fish was fried to perfection! Our server was really sweet. If you're looking for a good time check them out.", rating: 5 },
];

const upcomingEvents = [
  { title: "SEC Game Day Specials", date: "Every Saturday", desc: "Half-price wings & $5 draft beers during all SEC games" },
  { title: "Live Music Friday", date: "March 14, 2026", desc: "Live R&B and neo-soul band performing from 8PM" },
  { title: "Hookah & Cocktails Night", date: "Every Thursday", desc: "Premium hookah flavors with signature cocktail pairings" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="404 Sports Bar interior" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.img
            src={logo}
            alt="404 Sports Bar & Grill"
            className="h-20 md:h-28 w-auto mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.p
            className="text-lg md:text-xl text-foreground/80 mb-8 font-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Atlanta's home for great food, cold drinks & the best game-day vibes
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link to="/menu">
              <Button size="lg" className="gap-2">
                <UtensilsCrossed size={18} /> View Menu
              </Button>
            </Link>
            <Link to="/reservation">
              <Button size="lg" variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/10">
                <Calendar size={18} /> Reserve a Table
              </Button>
            </Link>
            <Link to="/order">
              <Button size="lg" variant="secondary" className="gap-2">
                Order Now <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto max-w-4xl text-center">
          <SectionHeading title="Welcome to 404" subtitle="Where sports meets Southern hospitality" />
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            Located in the heart of Atlanta on Glenwood Avenue, 404 Sports Bar & Grill is more than just a restaurant — it's an experience. 
            Whether you're catching the big game on one of our massive screens, enjoying our handcrafted cocktails, or diving into our 
            Southern-inspired menu, we've got everything you need for a perfect night out. From hookah nights to live music, there's always 
            something happening at 404.
          </p>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading title="Fan Favorites" subtitle="The dishes our guests can't stop ordering" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.map((dish, i) => (
              <motion.div
                key={dish.name}
                className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-colors"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display text-lg font-semibold">{dish.name}</h3>
                    <span className="text-primary font-semibold text-sm">{dish.price}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{dish.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/menu">
              <Button variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/10">
                View Full Menu <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="section-padding bg-secondary">
        <div className="container mx-auto">
          <SectionHeading title="Upcoming Events" subtitle="There's always something happening at 404" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.title}
                className="bg-card p-6 rounded-lg border border-border"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">{event.date}</span>
                <h3 className="font-display text-xl font-semibold mt-2 mb-2">{event.title}</h3>
                <p className="text-muted-foreground text-sm">{event.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/10">
                View All Events <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading title="What Our Guests Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-card p-6 rounded-lg border border-border"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm italic mb-4">"{t.text}"</p>
                <p className="text-primary font-semibold text-sm">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase mb-4">Ready to Experience 404?</h2>
          <p className="mb-8 opacity-90">Reserve your table or order your favorites for pickup now.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservation">
              <Button size="lg" variant="secondary">
                Reserve a Table
              </Button>
            </Link>
            <Link to="/order">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
