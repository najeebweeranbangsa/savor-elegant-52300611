import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const PrivacyPage = () => (
  <Layout>
    <section className="section-padding min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <SectionHeading title="Privacy Policy" />
        <div className="prose prose-invert prose-sm max-w-none text-muted-foreground space-y-6">
          <p>Last updated: March 8, 2026</p>
          <h3 className="font-display text-foreground text-lg">1. Information We Collect</h3>
          <p>We may collect personal information such as your name, email address, phone number, and other details when you make a reservation, place an order, submit an inquiry, or apply for a position.</p>
          <h3 className="font-display text-foreground text-lg">2. How We Use Your Information</h3>
          <p>Your information is used to process reservations, orders, catering inquiries, and job applications. We may also use it to send promotional updates if you opt in.</p>
          <h3 className="font-display text-foreground text-lg">3. Data Protection</h3>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          <h3 className="font-display text-foreground text-lg">4. Third-Party Services</h3>
          <p>We may use third-party services for ordering (e.g., DoorDash, Uber Eats). These services have their own privacy policies that govern how they handle your data.</p>
          <h3 className="font-display text-foreground text-lg">5. Cookies</h3>
          <p>Our website may use cookies to enhance your browsing experience. You can disable cookies in your browser settings.</p>
          <h3 className="font-display text-foreground text-lg">6. Contact</h3>
          <p>For privacy-related inquiries, please contact us at info@404sportsbar.com.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default PrivacyPage;
