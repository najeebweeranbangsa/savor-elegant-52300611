import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import cateringHero from "@/assets/spring-rolls.jpg";

const CateringPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const fullName = `${(data.get("first_name") as string).trim()} ${(data.get("last_name") as string).trim()}`;
    const phone = data.get("phone") as string;
    const email = data.get("email") as string;
    const eventType = data.get("event_type") as string;
    const eventDate = data.get("event_date") as string;
    const guests = parseInt(data.get("guests") as string) || 1;
    const details = (data.get("details") as string) || null;

    const { error } = await supabase.from("catering_inquiries").insert({
      full_name: fullName,
      email,
      phone,
      event_type: eventType,
      event_date: eventDate,
      guests,
      details,
    });

    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Thank you! We'll be in touch about your catering inquiry.");
      form.reset();

      supabase.functions.invoke("ghl-webhook", {
        body: {
          form_type: "catering",
          full_name: fullName,
          phone, email,
          event_type: eventType,
          event_date: eventDate,
          guests,
          details: details || "",
        },
      }).catch((err) => console.error("GHL sync error:", err));
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src={cateringHero} alt="Catering setup" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase text-gradient mb-3">Catering</h1>
          <p className="text-foreground/80 max-w-xl mx-auto">Let 404 Sports Bar & Grill bring the flavor to your next event</p>
        </div>
      </section>

      {/* Info + Form */}
      <section className="section-padding">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl">
          <div>
            <SectionHeading title="Let Us Cater Your Event" centered={false} />
            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
              <p>Whether it's a corporate event, birthday party, wedding reception, or game-day gathering, our catering team has you covered with delicious food and professional service.</p>
              <p><strong className="text-foreground">What we offer:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Customizable menus for any occasion</li>
                <li>Full-service catering with setup & cleanup</li>
                <li>Cocktail bar packages</li>
                <li>Hookah service for private events</li>
                <li>On-site and off-site catering available</li>
              </ul>
              <p>Fill out the inquiry form and a member of our team will get back to you within 24 hours.</p>
            </div>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
            <h3 className="font-display text-xl font-semibold mb-6">Catering Inquiry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="first_name" placeholder="First Name" required />
                <Input name="last_name" placeholder="Last Name" required />
              </div>
              <Input name="email" type="email" placeholder="Email Address" required />
              <Input name="phone" type="tel" placeholder="Phone Number" required />
              <Input name="event_type" placeholder="Event Type (e.g., Wedding, Corporate)" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="event_date" type="date" required />
                <Input name="guests" type="number" placeholder="Number of Guests" min={1} required />
              </div>
              <Textarea name="details" placeholder="Tell us more about your event..." rows={4} required />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Submit Inquiry"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CateringPage;
