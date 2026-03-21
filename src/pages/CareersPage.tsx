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
import careersHero from "@/assets/careers-hero.webp";

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
      {/* Hero + Form Split Layout */}
      <section className="section-padding">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: Form */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold uppercase mb-2">Careers</h1>
              <p className="text-muted-foreground text-lg mb-8">Join the 404 family — we're hiring!</p>

              {/* Openings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {openings.map((job) => (
                  <div key={job.title} className="bg-card p-4 rounded-lg border border-border">
                    <div className="flex items-start gap-3">
                      <Briefcase size={18} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-display text-base font-semibold">{job.title}</h3>
                        <span className="text-primary text-xs font-medium">{job.type}</span>
                        <p className="text-muted-foreground text-xs mt-1">{job.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Application Form */}
              <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                <h3 className="font-display text-xl font-semibold mb-6">Apply Now</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input name="first_name" placeholder="First Name" required />
                    <Input name="last_name" placeholder="Last Name" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input name="email" type="email" placeholder="Email Address" required />
                    <Input name="phone" type="tel" placeholder="Phone Number" required />
                  </div>
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

            {/* Right: Image */}
            <div className="hidden lg:block sticky top-24">
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={careersHero}
                  alt="404 Sports Bar team"
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CareersPage;
