import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ReservationPage = () => {
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const { error } = await supabase.from("reservations").insert({
      full_name: data.get("full_name") as string,
      phone: data.get("phone") as string,
      email: data.get("email") as string,
      reservation_date: data.get("date") as string,
      reservation_time: data.get("time") as string,
      guests: parseInt(guests) || 1,
      notes: (data.get("notes") as string) || null,
    });

    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Reservation request submitted! We'll confirm shortly.");
      form.reset();
      setGuests("");

      // Send to GoHighLevel in the background
      supabase.functions.invoke("ghl-webhook", {
        body: {
          full_name: data.get("full_name") as string,
          phone: data.get("phone") as string,
          email: data.get("email") as string,
          reservation_date: data.get("date") as string,
          reservation_time: data.get("time") as string,
          guests: parseInt(guests) || 1,
          notes: (data.get("notes") as string) || "",
        },
      }).catch((err) => console.error("GHL sync error:", err));
    }
  };

  return (
    <Layout>
      <section className="section-padding min-h-screen">
        <div className="container mx-auto max-w-xl">
          <SectionHeading title="Reserve a Table" subtitle="Book your spot at 404 Sports Bar & Grill" />
          <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="full_name" placeholder="Full Name" required />
              <Input name="phone" type="tel" placeholder="Phone Number" required />
              <Input name="email" type="email" placeholder="Email Address" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="date" type="date" required />
                <Input name="time" type="time" required />
              </div>
              <Select value={guests} onValueChange={setGuests} required>
                <SelectTrigger>
                  <SelectValue placeholder="Number of Guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                  <SelectItem value="10">10+ Guests</SelectItem>
                </SelectContent>
              </Select>
              <Textarea name="notes" placeholder="Special requests or notes..." rows={3} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Request Reservation"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ReservationPage;
