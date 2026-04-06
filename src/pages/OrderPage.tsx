import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const OrderPage = () => (
  <Layout>
    <section className="section-padding min-h-screen">
      <div className="container mx-auto max-w-2xl text-center">
        <SectionHeading title="Order Now" subtitle="Get your 404 favorites delivered or ready for pickup" />
        <div className="bg-card p-8 rounded-lg border border-border space-y-6">
          <p className="text-muted-foreground text-sm">
            Place your order online through Toast for pickup or delivery.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="gap-2" asChild>
              <a href="https://orders.404sportsbar.com/order/" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} /> Order on Toast
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default OrderPage;
