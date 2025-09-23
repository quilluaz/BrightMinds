import BubbleMenu from "@/components/ui/BubbleMenu";

export default function About() {
  return (
    <main className="relative min-h-screen bg-bmGreen text-white">
      <BubbleMenu />
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-spartan mb-4">About BrightMinds</h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl font-lexend">
          BrightMinds is an interactive learning platform designed to make education engaging and fun for students of all ages. Our mission is to combine compelling storytelling with educational content to create an unforgettable learning experience.
        </p>
      </section>
    </main>
  );
}