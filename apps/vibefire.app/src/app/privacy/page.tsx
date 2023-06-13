import type { NextPage } from "next";

import { Navbar } from "~/components/navbar";

const PrivacyPolicyPage: NextPage = () => {
  return (
    <>
      <Navbar active="privacy" />
      <div className="mx-5 mt-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold">{"Privacy Policy"}</h1>
        <div className="mx-10 mt-10 w-auto flex-col gap-5 md:w-3/6">
          <p>
            This privacy policy governs the manner in which Vibefire Limited
            (&quot;We&quot;) collects, uses, maintains, and discloses
            information collected from users of the https://vibefire.app/
            website and it&apos;s subdomains.
          </p>

          <h2 className="my-5 text-xl">Information Collection and Use</h2>

          <p>
            We may collect personal identification information from users in
            various ways, including when users visit our site, register on the
            site, subscribe to the newsletter, fill out a form, and engage in
            other activities, services, features, or resources available on our
            site. The personal identification information we may collect
            includes, but is not limited to, name, email address, mailing
            address, phone number, and credit card information.
          </p>

          <p>
            We will collect personal identification information from users only
            if they voluntarily submit such information to us. Users can always
            refuse to supply personally identification information, except that
            it may prevent them from engaging in certain site-related
            activities.
          </p>

          <p>
            We may also collect non-personal identification information about
            users whenever they interact with our site. This non-personal
            identification information may include browser name, computer type,
            and technical information about users&apos; means of connection to
            our site, such as the operating system and the internet service
            providers utilized, and other similar information.
          </p>

          <h3 className="my-5 text-lg">
            We use the collected information for the following purposes:
          </h3>

          <ul className="list-disc">
            <li>
              <span className="font-bold">Personalization:</span> We may use the
              information in aggregate to understand how our users, as a group,
              use the services and resources provided on our site. This helps us
              enhance the user experience and tailor our offerings accordingly.
            </li>
            <li>
              <span className="font-bold">Payment Processing:</span> When users
              place an order, we use the information they provide about
              themselves solely to provide service for that order. We do not
              share this information with outside parties except to the extent
              necessary to fulfill the service.
            </li>
            <li>
              <span className="font-bold">Communication:</span> We may use the
              email address users provide to send them information and updates
              related to their orders. It may also be used to respond to their
              inquiries, questions, and other requests. If users decide to
              opt-in to our mailing list, they will receive emails that may
              include company news, updates, related product or service
              information, etc.
            </li>
          </ul>

          <h2 className="my-5 text-xl">Information Sharing</h2>

          <p>
            We do not sell, trade, or rent users&apos; personal identification
            information to others. However, we may share generic aggregated
            demographic information, not linked to any personal identification,
            regarding visitors and users with our business partners, trusted
            affiliates, and advertisers for the purposes outlined above.
          </p>

          <h2 className="my-5 text-xl">Third-Party Websites</h2>

          <p>
            Our site may contain advertisements or other content that link to
            the sites and services of our partners, suppliers, advertisers,
            sponsors, licensors, and other third parties. We do not control the
            content or links that appear on these sites and are not responsible
            for the practices employed by websites linked to or from our site.
            These third-party sites or services, including their content and
            links, may be constantly changing. They may have their own privacy
            policies and customer service policies. Browsing and interaction on
            any other website, including websites that have a link to our site,
            are subject to that website&apos;s own terms and policies.
          </p>

          <h2 className="my-5 text-xl">Security</h2>

          <p>
            We are committed to adopting appropriate data collection, storage,
            and processing practices, as well as security measures, to protect
            against unauthorized access, alteration, disclosure, or destruction
            of personal information, usernames, passwords, transaction
            information, and data stored on our site.
          </p>

          <h2 className="my-5 text-xl">Changes to this Privacy Policy</h2>

          <p>
            We may update this privacy policy at any time. When we do, we will
            revise the updated date at the bottom of this page. We encourage
            users to frequently check this page for any changes to stay informed
            about how we are helping to protect the personal information we
            collect. You acknowledge and agree that it is your responsibility to
            review this privacy policy periodically and become aware of any
            modifications.
          </p>

          <h2 className="my-5 text-xl">Your Acceptance of these Terms</h2>

          <p>
            By using this site, you signify your acceptance of this policy. If
            you do not agree to this policy, please contact us at{" "}
            <a
              className="font-bold underline"
              href="mailto:support@vibefire.app"
            >
              support@vibefire.app
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
export default PrivacyPolicyPage;
