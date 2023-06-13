import type { NextPage } from "next";

import { Navbar } from "~/components/navbar";

const SupportPage: NextPage = () => {
  return (
    <>
      <Navbar active="support" />
      <header className="mx-5 mt-10 flex flex-col items-center gap-1">
        <h1 className="text-4xl font-bold">{"Support"}</h1>
        <p className="mt-10">
          For support with onboarding or help with the app, please contact the
          support team at:
        </p>
        <a
          className="mt-1 text-lg font-bold underline"
          href="mailto:support@vibefire.app"
        >
          support@vibefire.app
        </a>
        <p className="mt-2">
          If you have an account, send the email from the email address
          associated with your account.
        </p>
      </header>
    </>
  );
};
export default SupportPage;
