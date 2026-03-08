import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const TermsPage = () => (
  <Layout>
    <section className="section-padding min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <SectionHeading title="Terms of Use" />
        <div className="prose prose-invert prose-sm max-w-none text-muted-foreground space-y-6">
          <h3 className="font-display text-foreground text-lg">Introduction</h3>
          <p>Welcome to 404 Sports Bar & Grill. By accessing our website, you agree to these Terms of Use, our Privacy Policy, and any other legal notices published by us on the website. These terms govern your use of our website and its content. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

          <h3 className="font-display text-foreground text-lg">Intellectual Property Rights</h3>
          <p>The content published on 404 Sports Bar & Grill, including articles, photographs, videos, graphics, and overall design, is owned by us or our licensors and is protected by copyright, trademark, patent, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from our content without express written permission from us.</p>

          <h3 className="font-display text-foreground text-lg">Use License</h3>
          <p>(a) Permission is granted to temporarily download one copy of the materials (information or software) on The 404 Sports Bar & Grill's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, you may not:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on 404 Sports Bar & Grill's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p>(b) This license shall automatically terminate if you violate any of these restrictions and may be terminated by 404 Sports Bar & Grill at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>

          <h3 className="font-display text-foreground text-lg">Disclaimer</h3>
          <p>The materials on 404 Sports Bar & Grill's website are provided on an 'as is' basis. 404 Sports Bar & Grill makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          <p>Further, 404 Sports Bar & Grill does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>

          <h3 className="font-display text-foreground text-lg">Limitations</h3>
          <p>In no event shall 404 Sports Bar & Grill or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on 404 Sports Bar & Grill's website, even if 404 Sports Bar & Grill or a 404 Sports Bar & Grill authorized representative has been notified orally or in writing of the possibility of such damage.</p>

          <h3 className="font-display text-foreground text-lg">Links</h3>
          <p>404 Sports Bar & Grill has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by 404 Sports Bar & Grill of the site. Use of any such linked website is at the user's own risk.</p>

          <h3 className="font-display text-foreground text-lg">Modifications</h3>
          <p>404 Sports Bar & Grill may revise these terms of use for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms of Use.</p>

          <h3 className="font-display text-foreground text-lg">Contact Information</h3>
          <p>If you have any questions about these Terms of Use, please contact us.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default TermsPage;
