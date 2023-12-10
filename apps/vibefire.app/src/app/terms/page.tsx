import type { NextPage } from "next";

import { Navbar } from "~/components/navbar";

const TermsAndConditionsPage: NextPage = () => {
  return (
    <>
      <Navbar active="terms" />
      <div className="flex flex-col items-center p-5">
        <h1 className="text-4xl font-bold">Vibefire Terms of Service</h1>

        <div className="mx-10 mt-10 w-auto flex-col gap-5 md:w-3/6">
          <p>
            Welcome to Vibefire, the events app that highlights what&apos;s
            going on around you. Before you start using Vibefire, please take a
            moment to review the following Terms of Service (&quot;Terms&quot;).
            <br />
            <br />
            By accessing or using the Vibefire app, you agree to comply with and
            be bound by these Terms. If you do not agree with any part of these
            Terms, please do not use the Vibefire app.
          </p>

          <h2 className="my-5 text-xl">1. Acceptance of Terms</h2>
          <p>
            By using the Vibefire app, you agree to be bound by these Terms, as
            well as any additional terms and conditions that may apply. If you
            do not agree with any of these terms, you are prohibited from using
            or accessing the Vibefire app.
          </p>

          <h2 className="my-5 text-xl">2. User Registration</h2>
          <p>
            To access certain features of the Vibefire app, you may be required
            to create an account. You agree to provide accurate, current, and
            complete information during the registration process and to update
            such information to keep it accurate, current, and complete. You are
            responsible for maintaining the confidentiality of your account
            information and for all activities that occur under your account.
          </p>

          <h2 className="my-5 text-xl">3. Content and Conduct</h2>
          <p>
            (a) <span className="font-bold">User-Generated Content</span>:
            Vibefire allows users to post and share content related to events.
            You retain ownership of any content you submit to the Vibefire app,
            but by submitting content, you grant Vibefire a worldwide,
            non-exclusive, royalty-free license to use, reproduce, modify,
            adapt, publish, translate, create derivative works from, distribute,
            and display such content.
          </p>

          <p>
            (b) <span className="font-bold">Prohibited Conduct</span>: You agree
            not to engage in any of the following prohibited activities:
            <ul className="list-disc">
              <li>
                Use the Vibefire app for any illegal or unauthorized purpose.
              </li>
              <li>Violate any applicable laws or regulations.</li>
              <li>
                Post or transmit any content that is harmful, threatening,
                abusive, defamatory, obscene, or otherwise objectionable.
              </li>
              <li>Harass, stalk, or otherwise violate the rights of others.</li>
              <li>Interfere with or disrupt the Vibefire app or servers.</li>
              <li>
                Attempt to gain unauthorized access to any portion of the
                Vibefire app.
              </li>
            </ul>
          </p>

          <h2 className="my-5 text-xl">4. Events and Tickets</h2>
          <p>
            (a) <span className="font-bold">Event Listings</span>: Vibefire
            provides a platform for users to discover and share information
            about events. While Vibefire strives to provide accurate and
            up-to-date information, it does not guarantee the accuracy of event
            listings or the availability of tickets.
          </p>
          <p>
            (b) <span className="font-bold">Ticket Purchases</span>: If you
            choose to purchase tickets through the Vibefire app, you agree to
            abide by the terms and conditions set forth by the event organizer
            and any third-party ticketing platforms.
          </p>

          <h2 className="my-5 text-xl">5. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy to
            understand how we collect, use, and disclose information.
          </p>

          <h2 className="my-5 text-xl">6. Termination</h2>
          <p>
            Vibefire reserves the right to terminate or suspend your account and
            access to the app at its sole discretion, without prior notice, for
            any reason, including but not limited to a breach of these Terms.
          </p>

          <h2 className="my-5 text-xl">7. Changes to Terms</h2>
          <p>
            Vibefire reserves the right to update or modify these Terms at any
            time without prior notice. Your continued use of the Vibefire app
            after such changes constitutes acceptance of the updated Terms.
          </p>

          <h2 className="my-5 text-xl">8. Contact Information</h2>
          <p>
            If you have any questions or concerns about these Terms, please
            contact us at{" "}
            <a
              className="font-bold underline"
              href="mailto:support@vibefire.app"
            >
              support@vibefire.app
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
};
export default TermsAndConditionsPage;
