import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ReservationPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Reservation request submitted! We'll confirm shortly.");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <Layout>
      <section className="section-padding min-h-screen">
        <div className="container mx-auto max-w-xl">
          <SectionHeading title="Reserve a Table" subtitle="Book your spot at 404 Sports Bar & Grill" />
          <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Full Name" required />
              <Input type="tel" placeholder="Phone Number" required />
              <Input type="email" placeholder="Email Address" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input type="date" required />
                <Input type="time" required />
              </div>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Number of Guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                  <SelectItem value="10+">10+ Guests</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Special requests or notes..." rows={3} />
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
