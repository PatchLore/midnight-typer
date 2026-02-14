import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Cosmos Cartography ("the Service"), you agree to be bound by these Terms of Service, 
              all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
            <p>
              Cosmos Cartography provides a symbolic star registry service. Users can create and claim virtual representations 
              of stars in a digital constellation. This service is purely symbolic and does not confer any legal ownership 
              or astronomical rights to actual celestial bodies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You must be at least 13 years old to use this service</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree to accept responsibility for all activities that occur under your account</li>
              <li>You agree not to use the service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by Cosmos Cartography and are 
              protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Limitation of Liability</h2>
            <p>
              Cosmos Cartography shall not be liable for any indirect, incidental, special, consequential, or punitive 
              damages resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Disclaimer</h2>
            <p>
              The Service is provided "as is" and "as available" without any representations or warranties of any kind, 
              either express or implied. Cosmos Cartography does not warrant that the Service will be uninterrupted or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
              is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
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