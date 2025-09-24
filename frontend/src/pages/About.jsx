import { useState, useRef, useEffect } from "react";
import BubbleMenu from "@/components/ui/BubbleMenu";
import FaultyTerminal from "@/components/background/FaultyTerminal";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";
import ProfileCard from "@/components/ui/ProfileCard/ProfileCard";
import LogoLoop from "@/components/ui/LogoLoop";
import CountUp from "@/components/ui/CountUp";

const teamMembers = [
  {
    name: "Isaac Quilo",
    role: "Project Manager",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    name: "Ezekiel Saludsod",
    role: "Lead Developer",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    name: "Selina Genosolango",
    role: "UI/UX Designer",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    name: "Jeric Melocoton",
    role: "Backend Developer",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    name: "Justin Labajos",
    role: "Frontend Developer",
    imageUrl: "https://via.placeholder.com/150",
  },
];

const logos = [
  { src: "/LogoIconLight.svg" },
  { src: "/citu_logo.svg" },
  { src: "/jisaz_logo.svg" },
];

export default function About() {
  const [scrollStackCompleted, setScrollStackCompleted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const nextSectionRef = useRef(null);

  const handleScrollStackComplete = () => {
    console.log("ScrollStack animation completed");
    setScrollStackCompleted(true);
    setIsTransitioning(true);

    // Smooth scroll to the next section after a brief delay
    setTimeout(() => {
      if (nextSectionRef.current) {
        nextSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <main className="relative text-white bg-bmGreen" style={{ zIndex: 1 }}>
      <BubbleMenu />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-spartan mb-4">
          About BrightMinds
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl font-lexend">
          BrightMinds is an interactive learning platform designed to make
          education engaging and fun for students of all ages. Our mission is to
          combine compelling storytelling with educational content to create an
          unforgettable learning experience.
        </p>
      </section>

      {/* Why BrightMinds? Section */}
      <section className="py-16">
        <h2 className="text-3xl md:text-5xl font-bold font-spartan text-center mb-12">
          Why BrightMinds?
        </h2>
        <div className="relative">
          <ScrollStack
            useWindowScroll={true}
            itemDistance={120}
            itemScale={0.05}
            itemStackDistance={40}
            stackPosition="30%"
            scaleEndPosition="20%"
            baseScale={0.8}
            rotationAmount={2}
            blurAmount={1}
            onStackComplete={handleScrollStackComplete}>
            <ScrollStackItem>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-green-400">
                  Interactive Learning
                </h3>
                <p className="text-lg text-gray-300">
                  Engaging stories and interactive elements make learning fun
                  and memorable. Our platform transforms traditional education
                  into an immersive experience.
                </p>
              </div>
            </ScrollStackItem>

            <ScrollStackItem>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-blue-400">
                  Adaptive Content
                </h3>
                <p className="text-lg text-gray-300">
                  Content that adapts to each student's learning pace and style.
                  Personalized learning paths ensure optimal comprehension and
                  retention.
                </p>
              </div>
            </ScrollStackItem>

            <ScrollStackItem>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-purple-400">
                  Progress Tracking
                </h3>
                <p className="text-lg text-gray-300">
                  Monitor learning progress with detailed analytics and
                  insights. Real-time feedback helps students and educators
                  track improvement.
                </p>
              </div>
            </ScrollStackItem>

            <ScrollStackItem>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">
                  Gamified Experience
                </h3>
                <p className="text-lg text-gray-300">
                  Learning becomes a game with achievements, badges, and
                  rewards. Students stay motivated and engaged throughout their
                  educational journey.
                </p>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>

      </section>

      {/* Animated Stats Section */}
      <section
        ref={nextSectionRef}
        className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-bold font-spartan mb-12">
          Our Journey in Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <CountUp end={15000} suffix="+" />
            <p className="font-lexend text-lg">Lines of Code</p>
          </div>
          <div>
            <CountUp end={500} suffix="+" />
            <p className="font-lexend text-lg">Hours of Development</p>
          </div>
          <div>
            <CountUp end={100} suffix="+" />
            <p className="font-lexend text-lg">Cups of Coffee</p>
          </div>
        </div>
      </section>

      {/* Meet the Minds Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-5xl font-bold font-spartan text-center mb-12">
          Meet the Minds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {teamMembers.map((member) => (
            <ProfileCard
              key={member.name}
              showIconPattern={false}
              showUserInfo={false}
              {...member}
            />
          ))}
        </div>
      </section>

      {/* Supporters Section */}
      <section className="py-24">
        <h2 className="text-3xl md:text-5xl font-bold font-spartan text-center mb-12">
          Our Supporters
        </h2>
        <LogoLoop logos={logos} />
      </section>
    </main>
  );
}
