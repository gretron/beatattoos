import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";
import "@beatattoos/ui/globals";
import Navbar from "./_components/Navbar";
import LoadingContextProvider from "./_contexts/LoadingContext";

/**
 *  Proclamate Heavy font
 */
const proclamateHeavy = localFont({
  src: "./_fonts/Proclamate-Heavy.woff",
  variable: "--font-proclamate-heavy",
});

/**
 * Space Grotesk font
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

/**
 * Root layout metadata
 */
export const metadata: Metadata = {
  title: "@beatattoos",
  description: "Turn your body into a living masterpiece.",
};

/**
 * Root layout
 * @author David Ano-Trudeau
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body
          className={`${proclamateHeavy.variable} ${spaceGrotesk.variable}`}
        >
          <LoadingContextProvider>
            {/*<PageTransition />*/}
            <Navbar />
            {children}
          </LoadingContextProvider>
        </body>
      </html>
    </>
  );
}
