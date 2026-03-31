import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TIME_OPTIONS = (() => {
  const times: string[] = [];
  for (let h = 11; h <= 22; h++) {
    for (const m of ["00", "30"]) {
      const hour12 = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      times.push(`${hour12}:${m} ${ampm}`);
    }
  }
  return times;
})();

const ReservationPage = () => {
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState("");
  const [time, setTime] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [timeOpen, setTimeOpen] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const firstName = (data.get("first_name") as string).trim();
    const lastName = (data.get("last_name") as string).trim();
    const fullName = `${firstName} ${lastName}`;

    const { error } = await supabase.from("reservations").insert({
      full_name: fullName,
      phone: data.get("phone") as string,
      email: data.get("email") as string,
      reservation_date: data.get("date") as string,
      reservation_time: time,
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
      setTime("");
      setCustomTime("");

      supabase.functions.invoke("ghl-webhook", {
        body: {
          form_type: "reservation",
          first_name: firstName,
          last_name: lastName,
          phone: data.get("phone") as string,
          email: data.get("email") as string,
          reservation_date: data.get("date") as string,
          reservation_time: time,
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
              <div className="grid grid-cols-2 gap-4">
                <Input name="first_name" placeholder="First Name" required />
                <Input name="last_name" placeholder="Last Name" required />
              </div>
              <Input name="phone" type="tel" placeholder="Phone Number" required />
              <Input name="email" type="email" placeholder="Email Address" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="date" type="date" required className="[&::-webkit-calendar-picker-indicator]:invert" />
                <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <span className={time ? "text-foreground" : "text-muted-foreground"}>
                        {time || "Select Time"}
                      </span>
                      <Clock className="h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2 max-h-64 overflow-y-auto" align="start">
                    <div className="space-y-1">
                      <div className="flex gap-2 p-1">
                        <Input
                          type="time"
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="h-8 text-xs"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-8 text-xs shrink-0"
                          onClick={() => {
                            if (customTime) {
                              const [h, m] = customTime.split(":");
                              const hour = parseInt(h);
                              const ampm = hour >= 12 ? "PM" : "AM";
                              const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                              setTime(`${h12}:${m} ${ampm}`);
                              setTimeOpen(false);
                            }
                          }}
                        >
                          Set
                        </Button>
                      </div>
                      <div className="border-t border-border my-1" />
                      {TIME_OPTIONS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground ${time === t ? "bg-accent text-accent-foreground" : ""}`}
                          onClick={() => { setTime(t); setTimeOpen(false); }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Select value={guests} onValueChange={setGuests} required>
                <SelectTrigger>
                  <SelectValue placeholder="Number of Guests" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 40 }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
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
