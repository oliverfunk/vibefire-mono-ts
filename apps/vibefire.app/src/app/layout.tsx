import { type ReactNode } from "react";
import type { Metadata, Viewport } from "next";
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
  description: "We put events on the map!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" />
        <meta name="apple-itunes-app" content="app-id=6470950426" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
};
export default RootLayout;
