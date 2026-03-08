import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone } from "lucide-react";

const OrderPage = () => (
  <Layout>
    <section className="section-padding min-h-screen">
      <div className="container mx-auto max-w-2xl text-center">
        <SectionHeading title="Order Now" subtitle="Get your 404 favorites delivered or ready for pickup" />
        <div className="bg-card p-8 rounded-lg border border-border space-y-6">
          <p className="text-muted-foreground text-sm">
            Choose your preferred way to order. Place your order online through our partner platforms or call us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <a href="https://www.doordash.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} /> Order on DoorDash
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/10" asChild>
              <a href="https://www.ubereats.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} /> Order on Uber Eats
              </a>
            </Button>
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-muted-foreground text-sm mb-3">Or call us to place your order directly:</p>
            <Button variant="secondary" size="lg" className="gap-2" asChild>
              <a href="tel:+14045497977">
                <Phone size={18} /> (404) 549-7977
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default OrderPage;
