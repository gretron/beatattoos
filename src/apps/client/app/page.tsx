import { Metadata } from "next";
import Loader from "./_components/Loader";
import Hero from "./_components/Hero";
import Styles from "./_components/Styles";

/**
 * Home page metadata
 */
export const metadata: Metadata = {
  title: "Home — @beatattoos",
};

/**
 * Home page
 * @author David Ano-Trudeau
 */
export default function HomePage() {
  return (
    <>
      <main>
        <Loader />
        <Hero />
        <Styles />
      </main>
    </>
  );
}
