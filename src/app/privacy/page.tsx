import type { Metadata } from 'next';
import Link from 'next/link';
import { DeletionRequestForm } from './DeletionRequestForm';

export const metadata: Metadata = {
  title: 'Privacy Policy · CashSense',
  description:
    'CashSense Privacy Policy — how we collect, use, protect, and share information in the CashSense personal money management app.',
};

export default function PrivacyPolicyPage() {
  return (
    <main style={styles.page}>
      <article style={styles.article}>
        <header style={styles.header}>
          <Link href="/privacy" style={styles.brandLink}>
            <span style={styles.mark}>CS</span>
            <span>
              <span style={styles.brandName}>CashSense</span>
              <span style={styles.brandSub}>Make sense of your money.</span>
            </span>
          </Link>
          <h1 style={styles.title}>Privacy Policy</h1>
          <p style={styles.updated}>Last updated: September 23, 2026</p>
          <p style={{ margin: '12px 0 0' }}>
            <a href="#delete-request" style={styles.a}>
              Request account or data deletion
            </a>
          </p>
        </header>

        <p style={styles.lede}>
          CashSense respects your privacy and is committed to protecting the information you provide
          when using the CashSense mobile application and related services.
        </p>
        <p style={styles.p}>
          This Privacy Policy explains what information CashSense collects, how we use it, how we
          protect it, when it may be shared, and the choices available to you.
        </p>
        <p style={styles.p}>
          By using CashSense, you acknowledge the practices described in this Privacy Policy.
        </p>

        <Section n="1" title="About CashSense">
          <p style={styles.p}>
            CashSense is a personal money management application that helps users track income and
            spending, manage wallets and currencies, plan savings, manage debts, create allocations,
            and generate financial reports.
          </p>
          <p style={styles.p}>
            CashSense is designed to help users understand and organize their own financial
            information.
          </p>
          <ul style={styles.ul}>
            <li>
              <strong>App:</strong> CashSense
            </li>
            <li>
              <strong>Privacy contact:</strong>{' '}
              <a href="mailto:obiaws96@gmail.com" style={styles.a}>
                obiaws96@gmail.com
              </a>
            </li>
          </ul>
        </Section>

        <Section n="2" title="Information We Collect">
          <p style={styles.p}>
            Depending on how you use CashSense, we may collect the following categories of
            information.
          </p>

          <h3 style={styles.h3}>2.1 Account information</h3>
          <p style={styles.p}>When you create an account, we may collect information such as:</p>
          <ul style={styles.ul}>
            <li>Email address</li>
            <li>Account credentials or authentication information</li>
            <li>Account status and subscription/trial status</li>
            <li>Information necessary to maintain your CashSense account</li>
          </ul>
          <p style={styles.p}>
            We use this information to create and authenticate your account, maintain your session,
            provide access to the service, and manage your account status.
          </p>

          <h3 style={styles.h3}>2.2 Financial information you enter</h3>
          <p style={styles.p}>
            CashSense allows you to enter financial information for your personal money management.
            This may include:
          </p>
          <ul style={styles.ul}>
            <li>Income records</li>
            <li>Expense records</li>
            <li>Transaction amounts, dates, categories, and notes</li>
            <li>Wallet names and balances</li>
            <li>Currency information and custom exchange rates</li>
            <li>Savings goals and savings jar information</li>
            <li>Debt information</li>
            <li>Allocation percentages and financial plans</li>
            <li>Reports generated through the application</li>
          </ul>
          <p style={styles.p}>
            Financial information entered into CashSense is used to provide the application&apos;s
            money-management features. We do not use your financial information to make financial
            decisions on your behalf.
          </p>

          <h3 style={styles.h3}>2.3 Subscription and payment-related information</h3>
          <p style={styles.p}>
            CashSense may maintain information relating to your subscription or activation status.
          </p>
          <p style={styles.p}>
            For local subscription activation, users may independently make payment outside the
            application and provide payment confirmation through the support/activation process.
          </p>
          <p style={styles.p}>
            CashSense does not use the application as a Mobile Money or Orange Money
            transaction-processing system.
          </p>
          <p style={styles.p}>
            Where payment confirmation information is voluntarily provided to us for subscription
            activation, we may retain information reasonably necessary to verify and manage your
            subscription.
          </p>

          <h3 style={styles.h3}>2.4 Reports and exported information</h3>
          <p style={styles.p}>
            CashSense allows you to generate financial reports, including CSV reports. Reports may
            contain information derived from your transactions and other financial information
            entered into the application. You control where exported reports are saved or shared
            using your device&apos;s available sharing functionality.
          </p>

          <h3 style={styles.h3}>2.5 Device and technical information</h3>
          <p style={styles.p}>
            CashSense may process limited technical information necessary to operate, secure,
            troubleshoot, synchronize, and improve the service. Depending on the application&apos;s
            implementation, this may include:
          </p>
          <ul style={styles.ul}>
            <li>Device or application identifiers</li>
            <li>Operating system information</li>
            <li>Application version</li>
            <li>Error or diagnostic information</li>
            <li>Connectivity and synchronization information</li>
          </ul>
          <p style={styles.p}>
            CashSense does not intentionally collect precise location information unless a future
            feature specifically requires it and the appropriate disclosure and permission are
            provided.
          </p>
        </Section>

        <Section n="3" title="How We Use Information">
          <p style={styles.p}>We may use information collected through CashSense to:</p>
          <ul style={styles.ul}>
            <li>Create and maintain user accounts</li>
            <li>Authenticate users and restore sessions</li>
            <li>Provide money-management functionality</li>
            <li>Store and synchronize user financial information</li>
            <li>Provide cloud backup where enabled</li>
            <li>Calculate financial summaries and allocations</li>
            <li>Display wallet balances and currency conversions</li>
            <li>Track savings goals and debts</li>
            <li>Generate reports</li>
            <li>Manage trial and subscription status</li>
            <li>Provide customer support</li>
            <li>Verify subscription activation where applicable</li>
            <li>Detect, investigate, and prevent misuse or unauthorized access</li>
            <li>Diagnose technical problems</li>
            <li>Maintain and improve the reliability and security of CashSense</li>
            <li>Comply with applicable legal obligations</li>
          </ul>
          <p style={styles.p}>
            We use financial information primarily to provide the features requested by the user.
          </p>
        </Section>

        <Section n="4" title="How Financial Information Is Used">
          <p style={styles.p}>
            CashSense is a personal money-management tool. The financial information you enter is
            used to provide features such as monthly income and spending summaries, spending
            category breakdowns, wallet balances, allocation tracking, savings progress, debt
            tracking, currency conversion, and financial reports.
          </p>
          <p style={styles.p}>
            CashSense does not represent itself as a bank, financial institution, investment adviser,
            lender, or payment processor. Information displayed by CashSense is based on information
            entered or configured by the user.
          </p>
        </Section>

        <Section n="5" title="Offline Storage and Synchronization">
          <p style={styles.p}>
            CashSense is designed as an offline-first application. Some information may be stored
            locally on your device so that you can use the application without an active internet
            connection.
          </p>
          <p style={styles.p}>
            When synchronization or cloud backup is enabled and an internet connection is available,
            relevant account and application data may be transmitted to our backend systems for
            synchronization and backup.
          </p>
          <p style={styles.p}>
            The information stored locally may remain on your device until it is deleted by the
            application, the user, or through an appropriate account/device data deletion process.
          </p>
          <p style={styles.p}>
            If you sign out, CashSense may clear locally stored account data from the device to help
            prevent another user of the device from accessing the previous user&apos;s locally stored
            information.
          </p>
        </Section>

        <Section n="6" title="Data Sharing">
          <p style={styles.p}>We do not sell your personal information.</p>
          <p style={styles.p}>We may disclose information only when reasonably necessary to:</p>
          <ul style={styles.ul}>
            <li>Provide and operate CashSense</li>
            <li>
              Provide backend hosting, storage, synchronization, security, or other services
              necessary for the application
            </li>
            <li>Provide customer support</li>
            <li>Process or verify subscription-related information where applicable</li>
            <li>Comply with legal obligations or valid legal requests</li>
            <li>Protect the rights, security, and property of CashSense, its users, or others</li>
            <li>Detect or prevent fraud, abuse, security incidents, or unauthorized activity</li>
          </ul>
          <p style={styles.p}>
            Where third-party service providers are used to operate parts of CashSense, those
            providers may process information on our behalf as necessary to provide their services.
          </p>
          <p style={styles.p}>
            We do not authorize third parties to use your financial information for purposes
            unrelated to providing their contracted services to CashSense, except where otherwise
            required or permitted by applicable law.
          </p>
        </Section>

        <Section n="7" title="Data Security">
          <p style={styles.p}>
            We take reasonable technical and organizational measures to protect information handled
            by CashSense against unauthorized access, loss, misuse, alteration, or disclosure.
            These measures may include authentication controls, access controls, secure
            transmission where supported, server-side security controls, local data protection
            mechanisms, restricting administrative access to authorized personnel, and monitoring
            and addressing security issues.
          </p>
          <p style={styles.p}>
            No method of electronic storage or transmission is completely secure. Therefore, while
            we work to protect your information, we cannot guarantee absolute security.
          </p>
          <p style={styles.p}>
            You are also responsible for protecting access to your device, account credentials, and
            any exported reports you choose to store or share.
          </p>
        </Section>

        <Section n="8" title="Data Retention">
          <p style={styles.p}>We retain information for as long as reasonably necessary to:</p>
          <ul style={styles.ul}>
            <li>Provide CashSense services</li>
            <li>Maintain your account</li>
            <li>Provide synchronization and backup</li>
            <li>Maintain subscription records</li>
            <li>Resolve disputes or support requests</li>
            <li>Meet legal, regulatory, security, or accounting requirements</li>
          </ul>
          <p style={styles.p}>
            When information is no longer required for these purposes, we will take reasonable steps
            to delete or anonymize it, subject to applicable legal or legitimate operational
            requirements.
          </p>
        </Section>

        <Section n="9" title="Account Deletion">
          <p style={styles.p}>
            If you have a CashSense account, you may request deletion of your account and associated
            personal information, or request deletion of your stored data.
          </p>
          <p style={styles.p}>
            Use the form below to prepare an email to{' '}
            <a href="mailto:obiaws96@gmail.com" style={styles.a}>
              obiaws96@gmail.com
            </a>
            . Your request should identify the CashSense account email you want processed.
          </p>
          <p style={styles.p}>
            <a href="#delete-request" style={styles.a}>
              Jump to deletion request form →
            </a>
          </p>
          <DeletionRequestForm />
          <p style={styles.p}>
            When a valid account-deletion request is processed, we will delete or anonymize
            associated personal information and account data within a reasonable period, subject to
            information that we are legally required or legitimately permitted to retain.
          </p>
          <p style={styles.p}>
            Some information may need to be retained for a limited period where required for legal,
            security, fraud-prevention, dispute-resolution, or accounting purposes.
          </p>
          <p style={styles.p}>
            Account deletion may permanently remove access to your CashSense data and cannot
            necessarily be reversed.
          </p>
        </Section>

        <Section n="10" title="Your Choices and Rights">
          <p style={styles.p}>
            Depending on your location and applicable law, you may have rights relating to your
            personal information, including the ability to:
          </p>
          <ul style={styles.ul}>
            <li>Request access to personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and associated information</li>
            <li>Ask questions about how your information is used</li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Request information about data sharing and processing</li>
          </ul>
          <p style={styles.p}>
            To make a privacy-related request, contact{' '}
            <a href="mailto:obiaws96@gmail.com" style={styles.a}>
              obiaws96@gmail.com
            </a>
            . We may need to verify your identity before completing certain requests.
          </p>
        </Section>

        <Section n="11" title="Children's Privacy">
          <p style={styles.p}>
            CashSense is intended for general users and is not specifically designed for children.
            We do not knowingly collect personal information from children in violation of
            applicable law.
          </p>
          <p style={styles.p}>
            If you believe that a child has provided personal information to CashSense without
            appropriate authorization, please contact us at{' '}
            <a href="mailto:obiaws96@gmail.com" style={styles.a}>
              obiaws96@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section n="12" title="Third-Party Services">
          <p style={styles.p}>
            CashSense may rely on third-party infrastructure or service providers to provide
            functions such as hosting, authentication, storage, synchronization, communications,
            analytics, crash reporting, or other technical services.
          </p>
          <p style={styles.p}>
            Where such services are used, their handling of information may also be governed by
            their own privacy policies and terms. We will update this Privacy Policy when material
            changes are made to the services or third parties that affect how user information is
            handled.
          </p>
        </Section>

        <Section n="13" title="External Links and Sharing">
          <p style={styles.p}>
            CashSense may provide options for users to contact support or share reports through
            applications and services available on their device, such as messaging or email
            applications. When you choose to share information outside CashSense, the receiving
            service&apos;s own privacy policy and practices apply.
          </p>
          <p style={styles.p}>
            You are responsible for reviewing information before sharing it and choosing an
            appropriate recipient.
          </p>
        </Section>

        <Section n="14" title="International Data Processing">
          <p style={styles.p}>
            Depending on the infrastructure used to operate CashSense, your information may be
            stored or processed in countries other than the country in which you live. Where this
            occurs, we will take reasonable measures to protect your information and comply with
            applicable legal requirements.
          </p>
        </Section>

        <Section n="15" title="Changes to This Privacy Policy">
          <p style={styles.p}>
            We may update this Privacy Policy from time to time to reflect changes to CashSense, our
            data practices, legal requirements, or security practices. When we make material
            changes, we may provide an appropriate notice through the application or other
            reasonable means.
          </p>
          <p style={styles.p}>
            The “Last updated” date at the top of this Privacy Policy indicates when the policy was
            most recently revised.
          </p>
        </Section>

        <Section n="16" title="Contact Us">
          <p style={styles.p}>
            If you have questions, concerns, requests, or complaints about privacy or how CashSense
            handles information, contact:
          </p>
          <ul style={styles.ul}>
            <li>
              <strong>CashSense Privacy Support</strong>
            </li>
            <li>
              Email:{' '}
              <a href="mailto:obiaws96@gmail.com" style={styles.a}>
                obiaws96@gmail.com
              </a>
            </li>
            <li>
              Phone:{' '}
              <a href="tel:+231773260121" style={styles.a}>
                +231 773 260 121
              </a>
            </li>
          </ul>
          <p style={styles.p}>
            We encourage users to contact us first so that we can investigate and address privacy
            concerns.
          </p>
        </Section>

        <Section n="17" title="Acceptance">
          <p style={styles.p}>
            By creating or using a CashSense account, you acknowledge that you have had an
            opportunity to review this Privacy Policy and understand how CashSense handles
            information as described above.
          </p>
        </Section>

        <footer style={styles.footer}>
          <div style={styles.footerBrand}>CashSense</div>
          <div style={styles.footerTag}>Make sense of your money.</div>
        </footer>
      </article>
    </main>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.section} id={`section-${n}`}>
      <h2 style={styles.h2}>
        {n}. {title}
      </h2>
      {children}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '32px 20px 64px',
  },
  article: {
    maxWidth: 720,
    margin: '0 auto',
    background: 'rgba(255,255,255,0.94)',
    border: '1px solid rgba(43,58,103,0.1)',
    borderRadius: 24,
    padding: '36px 28px 40px',
    boxShadow: '0 20px 50px rgba(30,42,77,0.08)',
  },
  header: {
    marginBottom: 24,
  },
  brandLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
    color: 'inherit',
    marginBottom: 28,
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(145deg, #2B3A67, #1E2A4D)',
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 15,
    letterSpacing: '-0.02em',
  },
  brandName: {
    display: 'block',
    fontWeight: 800,
    fontSize: 16,
    color: '#2B3A67',
  },
  brandSub: {
    display: 'block',
    fontSize: 12,
    color: '#5C6478',
    marginTop: 2,
  },
  title: {
    margin: '20px 0 8px',
    fontSize: 32,
    fontWeight: 800,
    color: '#1A1F2E',
    letterSpacing: '-0.02em',
  },
  updated: {
    margin: 0,
    fontSize: 14,
    color: '#5C6478',
  },
  lede: {
    fontSize: 16,
    lineHeight: 1.6,
    color: '#1A1F2E',
    margin: '0 0 14px',
  },
  section: {
    marginTop: 32,
    paddingTop: 8,
    borderTop: '1px solid #E4E2DC',
  },
  h2: {
    margin: '0 0 12px',
    fontSize: 20,
    fontWeight: 800,
    color: '#2B3A67',
  },
  h3: {
    margin: '20px 0 8px',
    fontSize: 16,
    fontWeight: 700,
    color: '#1A1F2E',
  },
  p: {
    margin: '0 0 12px',
    fontSize: 15,
    lineHeight: 1.65,
    color: '#2A3142',
  },
  ul: {
    margin: '0 0 12px',
    paddingLeft: 22,
    fontSize: 15,
    lineHeight: 1.65,
    color: '#2A3142',
  },
  a: {
    color: '#0E7C66',
    fontWeight: 600,
  },
  footer: {
    marginTop: 40,
    paddingTop: 24,
    borderTop: '1px solid #E4E2DC',
    textAlign: 'center' as const,
  },
  footerBrand: {
    fontWeight: 800,
    fontSize: 18,
    color: '#2B3A67',
  },
  footerTag: {
    marginTop: 4,
    fontSize: 13,
    color: '#5C6478',
  },
  homeLink: {
    display: 'inline-block',
    marginTop: 18,
    color: '#2B3A67',
    fontWeight: 600,
    textDecoration: 'none',
    fontSize: 14,
  },
};
