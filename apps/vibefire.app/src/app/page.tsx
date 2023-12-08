import type { NextPage } from "next";
import Image from "next/image";

import { Navbar } from "~/components/navbar";
import iPhoneMockImage from "~/public/ex.png";

const Home: NextPage = () => {
  return (
    <>
      <Navbar active="none" />
      <div className="flex flex-col justify-center gap-7 overflow-x-auto py-10 md:flex-row md:gap-10">
        <div className="flex flex-col justify-center text-center md:justify-start md:pt-20">
          <h1 className="text-4xl font-bold">{"This is"}</h1>
          <h1 className="mt-2 text-6xl font-black">
            {"Vibe"}
            <span className="animate-text bg-gradient-to-r  from-red-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              {"fire"}
            </span>
          </h1>
          <h2 className="mt-5 text-center text-2xl">
            {"Discover events around you"}
          </h2>
        </div>

        <div className="flex flex-col items-center ">
          <Image
            className="w-80"
            src={iPhoneMockImage}
            priority={true}
            alt="iPhone14 mockup image of the app"
          ></Image>
        </div>
      </div>
    </>
  );
};
export default Home;
