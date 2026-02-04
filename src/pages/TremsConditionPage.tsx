import React from "react";

export default function TremsConditionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="mx-auto max-w-7xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Terms & Conditions
        </h1>

        <Section title="1. About In-Klein Elevators">
          <p>
            In-Klein Elevators is a technology platform that connects elevator
            job requesters with independent elevator contractors. In-Klein does
            not perform elevator services and is not an employer, partner,
            agent, or subcontractor of any user.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>To use In-Klein, you must:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Be at least 18 years old</li>
            <li>Have the legal authority to enter binding contracts</li>
            <li>Provide accurate and complete account information</li>
          </ul>
          <p className="mt-2">
            We reserve the right to suspend or terminate accounts that violate
            these requirements.
          </p>
        </Section>

        <Section title="3. Platform Use & Off-Platform Circumvention">
          <p>
            All job postings, bids, communications, agreements, and payments
            must be initiated, conducted, and completed exclusively through the
            In-Klein platform.
          </p>
          <p className="mt-2">Users may not:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Complete a project off-platform that originated on In-Klein</li>
            <li>
              Exchange contact or payment information to avoid platform fees
            </li>
            <li>Enter side agreements outside the platform</li>
          </ul>
          <p className="mt-2">
            Any project that originates on In-Klein and is completed or paid for
            outside the platform constitutes a material breach of these Terms &
            Conditions.
          </p>
          <p className="mt-2">
            In such cases, In-Klein retains the right to collect its 10%
            platform service fee, regardless of where or how payment was made.
            In-Klein further reserves the right to pursue legal action, damages,
            and reasonable costs of enforcement, including attorney’s fees.
          </p>
        </Section>

        <Section title="4. Fees & Payments">
          <p>
            In-Klein charges a 10% platform service fee on the final agreed
            project price for all projects initiated through the platform.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>The service fee applies even if payment occurs off-platform</li>
            <li>Fees are non-refundable once work has begun</li>
            <li>
              Failure to pay required fees may result in account suspension,
              termination, collections, or legal action
            </li>
          </ul>
          <p className="mt-2">
            Payments may be processed through third-party payment providers.
          </p>
        </Section>

        <Section title="5. Contractors">
          <p>Contractors using In-Klein represent and warrant that they:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Hold all required licenses, certifications, and insurance</li>
            <li>Comply with all applicable local, state, and federal laws</li>
            <li>
              Perform services professionally, safely, and in accordance with
              industry standards
            </li>
          </ul>
          <p className="mt-2">
            Contractors are independent parties and not employees or agents of
            In-Klein.
          </p>
        </Section>

        <Section title="6. Job Requesters">
          <p>Job requesters agree to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide accurate job descriptions and site details</li>
            <li>Pay the agreed project amount through the In-Klein platform</li>
            <li>Not modify payment terms outside the platform</li>
          </ul>
          <p className="mt-2">
            Failure to comply may result in account suspension or termination.
          </p>
        </Section>

        <Section title="7. Disputes & Liability">
          <p>In-Klein is not responsible for:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Work quality, delays, defects, or failures</li>
            <li>Injuries, damages, or losses related to any project</li>
            <li>Contractor compliance with laws or regulations</li>
          </ul>
          <p className="mt-2">
            Disputes must be resolved directly between job requesters and
            contractors. In-Klein may offer mediation support but is not
            obligated to do so.
          </p>
        </Section>

        <Section title="8. Liquidated Damages">
          <p>
            Users acknowledge that off-platform circumvention causes financial
            harm to In-Klein that is difficult to quantify. In the event of such
            breach, users agree that the 10% platform service fee represents a
            reasonable estimate of damages and is payable immediately upon
            demand.
          </p>
        </Section>

        <Section title="9. Prohibited Conduct">
          <p>Users may not:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Circumvent platform fees</li>
            <li>Post false, misleading, or fraudulent jobs or bids</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Use the platform for unlawful purposes</li>
            <li>Attempt to copy, reverse-engineer, or exploit the platform</li>
          </ul>
          <p className="mt-2">
            Violations may result in immediate account termination.
          </p>
        </Section>

        <Section title="10. Intellectual Property">
          <p>
            All content, branding, logos, software, and platform features are
            the exclusive property of In-Klein Elevators. Unauthorized use is
            prohibited.
          </p>
        </Section>

        <Section title="11. Account Termination">
          <p>
            In-Klein may suspend or terminate any account at its sole discretion
            for violations of these Terms & Conditions, with or without notice.
          </p>
        </Section>

        <Section title="12. Changes to Terms">
          <p>
            We may update these Terms & Conditions at any time. Continued use of
            the platform constitutes acceptance of the updated terms.
          </p>
        </Section>

        <Section title="13. Governing Law">
          <p>
            These Terms & Conditions are governed by the laws of the State of
            New Jersey, United States, without regard to conflict-of-law
            principles.
          </p>
        </Section>

        <Section title="14. Contact">
          <p>
            For questions regarding these Terms & Conditions, please contact:
          </p>
          <p className="mt-2 font-medium">support @ kleinelevator@gmail.com</p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}
