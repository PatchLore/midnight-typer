import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
            <p>
              We collect information to provide better services to all our users. The information we collect includes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Personal Information:</strong> Email address when you create an account or make a purchase</li>
              <li><strong>Usage Data:</strong> Information about how you use our service, including typing statistics and star claims</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe, we do not store payment details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Provide and maintain our service</li>
              <li>Create and manage your star registry account</li>
              <li>Process payments and send receipts</li>
              <li>Send you updates about your stars and certificates</li>
              <li>Improve our service and develop new features</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Data Protection</h2>
            <p>
              We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, 
              or destruction of information. Your personal data is stored securely and is only accessible by authorized personnel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, 
              including for the purposes of satisfying any legal, accounting, or reporting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You may also object to or restrict 
              the processing of your data. To exercise these rights, please contact us at{' '}
              <Link href="mailto:contact@cosmoscartography.com" className="text-blue-400 hover:text-blue-300">
                contact@cosmoscartography.com
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Third-Party Services</h2>
            <p>
              Our service may contain links to third-party websites or services that are not owned or controlled by Cosmos Cartography. 
              We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If we become aware that we have collected personal information from a child under 13, 
              we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
              on this page and updating the "Last updated" date at the bottom of this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <Link href="mailto:contact@cosmoscartography.com" className="text-blue-400 hover:text-blue-300">
                contact@cosmoscartography.com
              </Link>
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Last updated: February 2026</p>
        </div>
      </div>
    </div>
  );
}