import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import careersHero from "@/assets/careers-hero.avif";

const openings = [
  { title: "Line Cook", type: "Full-Time", desc: "Experienced line cook to join our kitchen team. Must have restaurant experience." },
  { title: "Bartender", type: "Full-Time / Part-Time", desc: "Skilled bartender with craft cocktail experience. Must be 21+." },
  { title: "Server", type: "Part-Time", desc: "Friendly and energetic server to deliver excellent guest experiences." },
  { title: "Host/Hostess", type: "Part-Time", desc: "Welcoming personality to manage seating and guest flow." },
];

const CareersPage = () => {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const fullName = `${(data.get("first_name") as string).trim()} ${(data.get("last_name") as string).trim()}`;
    const phone = data.get("phone") as string;
    const email = data.get("email") as string;
    const experience = (data.get("experience") as string) || null;

    const { error } = await supabase.from("career_applications").insert({
      full_name: fullName,
      email,
      phone,
      position,
      experience,
    });

    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Application submitted! We'll be in touch.");
      form.reset();
      setPosition("");

      supabase.functions.invoke("ghl-webhook", {
        body: {
          form_type: "careers",
          full_name: fullName,
          phone, email,
          position,
          experience: experience || "",
        },
      }).catch((err) => console.error("GHL sync error:", err));
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
        <img src={careersHero} alt="404 Sports Bar team" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase mb-2">Careers</h1>
          <p className="text-muted-foreground text-lg">Join the 404 family, we're hiring!</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          {/* Openings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
            {openings.map((job) => (
              <div key={job.title} className="bg-card p-5 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <Briefcase size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-lg font-semibold">{job.title}</h3>
                    <span className="text-primary text-xs font-medium">{job.type}</span>
                    <p className="text-muted-foreground text-sm mt-1">{job.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Application Form */}
          <div className="max-w-xl mx-auto bg-card p-6 md:p-8 rounded-lg border border-border">
            <h3 className="font-display text-xl font-semibold mb-6 text-center">Apply Now</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="first_name" placeholder="First Name" required />
                <Input name="last_name" placeholder="Last Name" required />
              </div>
              <Input name="email" type="email" placeholder="Email Address" required />
              <Input name="phone" type="tel" placeholder="Phone Number" required />
              <Select value={position} onValueChange={setPosition} required>
                <SelectTrigger>
                  <SelectValue placeholder="Position of Interest" />
                </SelectTrigger>
                <SelectContent>
                  {openings.map((job) => (
                    <SelectItem key={job.title} value={job.title}>{job.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea name="experience" placeholder="Tell us about your experience..." rows={4} required />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CareersPage;
