import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const TermsPage = () => (
  <Layout>
    <section className="section-padding min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <SectionHeading title="Terms of Use" />
        <div className="prose prose-invert prose-sm max-w-none text-muted-foreground space-y-6">
          <p>Last updated: March 8, 2026</p>
          <h3 className="font-display text-foreground text-lg">1. Acceptance of Terms</h3>
          <p>By accessing and using the 404 Sports Bar & Grill website, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          <h3 className="font-display text-foreground text-lg">2. Use of Website</h3>
          <p>This website is provided for informational purposes and to facilitate restaurant services including reservations, ordering, and event inquiries. You agree to use the website only for lawful purposes.</p>
          <h3 className="font-display text-foreground text-lg">3. Intellectual Property</h3>
          <p>All content on this website, including text, images, logos, and design elements, is the property of 404 Sports Bar & Grill and is protected by applicable intellectual property laws.</p>
          <h3 className="font-display text-foreground text-lg">4. Limitation of Liability</h3>
          <p>404 Sports Bar & Grill shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.</p>
          <h3 className="font-display text-foreground text-lg">5. Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time. Continued use of the website constitutes acceptance of any changes.</p>
          <h3 className="font-display text-foreground text-lg">6. Contact</h3>
          <p>For questions about these terms, please contact us at info@404sportsbar.com.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default TermsPage;
