import { type ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Vibefire - Coming soon!",
  description: "Event discovery evolved",
  viewport: "width=device-width, initial-scale=1",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
};
export default RootLayout;
