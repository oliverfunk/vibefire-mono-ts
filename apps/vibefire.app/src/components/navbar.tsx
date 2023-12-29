/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import Link from "next/link";

import VibefireIcon from "~/public/Icon_Circle_wOutline.svg";

// import VibefireIcon from "@/public/Icon_Circle_Border.svg";
interface NavbarProps {
  active: "none" | "support" | "privacy" | "terms" | "faq";
}

const Navbar: React.FC<NavbarProps> = ({ active }) => {
  return (
    <header className="sticky top-0 z-10 mx-auto flex w-full flex-wrap items-center justify-between gap-y-1 bg-black bg-opacity-90 px-8 py-5 text-white drop-shadow-[0_3px_3px_rgba(0,255,255,0.25)]">
      <Link href="/" className="m-1 inline-flex  items-center">
        <Image priority={true} src={VibefireIcon} alt={""} className="w-10" />
        <h1 className="pl-2 text-xl font-bold">{"Vibefire"}</h1>
      </Link>
      <nav className="flex flex-nowrap items-center justify-between gap-x-4 overflow-x-auto text-sm md:gap-x-8">
        <Link
          role="button"
          href="/support"
          className={
            "m-1 rounded px-3 py-2 font-semibold " +
            (active == "support"
              ? "bg-slate-500"
              : "hover:bg-slate-500 hover:bg-opacity-50")
          }
        >
          Support
        </Link>
        <Link
          role="button"
          href="/privacy"
          className={
            "m-1 rounded px-3 py-2 font-semibold " +
            (active == "privacy"
              ? "bg-slate-500"
              : "hover:bg-slate-500 hover:bg-opacity-50")
          }
        >
          Privacy Policy
        </Link>
        <Link
          role="button"
          href="/terms"
          className={
            "m-1 rounded px-3 py-2 font-semibold " +
            (active == "terms"
              ? "bg-slate-500"
              : "hover:bg-slate-500 hover:bg-opacity-50")
          }
        >
          Terms
        </Link>
        <Link
          role="button"
          href="/faq"
          className={
            "m-1 rounded px-3 py-2 font-semibold " +
            (active == "terms"
              ? "bg-slate-500"
              : "hover:bg-slate-500 hover:bg-opacity-50")
          }
        >
          FAQ
        </Link>
        {/* <a
          role="button"
          href="https://web.vibefire.app/"
          className="m-1 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Squares2X2Icon
            className="-ml-0.5 mr-1.5 w-5 flex-shrink-0"
            aria-hidden="true"
          />
          Launch app
        </a> */}
      </nav>
    </header>
  );
};
Navbar.defaultProps = {
  active: "none",
};
export { Navbar };
