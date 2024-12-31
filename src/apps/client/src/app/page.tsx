import Hero from "~/app/_components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className={"section-curve"}></div>
      <div className={"relative h-screen bg-accent-500"}></div>
    </main>
  );
}
