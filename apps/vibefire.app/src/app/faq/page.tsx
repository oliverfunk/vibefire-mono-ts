import type { NextPage } from "next";

import { Navbar } from "~/components/navbar";

const FAQPage: NextPage = () => {
  return (
    <>
      <Navbar active="faq" />
      <div className="flex flex-col items-center p-5">
        <h1 className="text-4xl font-bold">FAQ</h1>

        <div className="mx-10 mt-10 w-auto flex-col gap-5 md:w-3/6">
          <h2 className="my-5 text-xl">
            1. How do I request that my account and associated data is deleted?
          </h2>
          <p>
            If you would like to have all your account information (including
            all events and groups you are the sole admin of) deleted please
            contact us at{" "}
            <a
              className="font-bold underline"
              href="mailto:support@vibefire.app"
            >
              support@vibefire.app
            </a>{" "}
            using the same email address as the account you registered with.
          </p>
          <p>
            All events and groups that you share responsibility for will remain
            until the last responsible person deletes their account.
          </p>
          <p>
            Events and groups can be manually delete before deleting your
            account.
          </p>
        </div>
      </div>
    </>
  );
};
export default FAQPage;
