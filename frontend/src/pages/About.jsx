import { useState, useRef, useEffect } from "react";
import BubbleMenu from "@/components/ui/BubbleMenu";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";
import ProfileCard from "@/components/ui/ProfileCard/ProfileCard";
import LogoLoop from "@/components/ui/LogoLoop";
import CountUp from "@/components/ui/CountUp";

const teamMembers = [
  {
    name: "Isaac Quilo",
    role: "Lead Developer",
    imageUrl:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1760725835/5_roituv.png",
  },
  {
    name: "Ezekiel Saludsod",
    role: "Team Lead",
    imageUrl:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1760725834/4_btmwlm.png",
  },
  {
    name: "Selina Genosolango",
    role: "Frontend Lead",
    imageUrl:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1760725833/1_i8yriu.png",
  },
  {
    name: "Jeric Melocoton",
    role: "Backend Lead",
    imageUrl:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1760725834/3_i9hx06.png",
  },
  {
    name: "Justin Labajos",
    role: "Frontend and Backend Developer",
    imageUrl:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1760725833/2_qnpvvb.png",
  },
];

const logos = [{ src: "/citu_logo.svg" }, { src: "/jisaz_logo.svg" }];

export default function About() {
  const [scrollStackCompleted, setScrollStackCompleted] = useState(false);

  const handleScrollStackComplete = () => {
    console.log("ScrollStack animation completed");
    setScrollStackCompleted(true);
    // Removed forced scroll - let user scroll naturally
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

      </section>

      {/* Animated Stats Section */}
      <section className="container mx-auto px-4 py-24 text-center">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* First row - 3 columns */}
          {teamMembers.slice(0, 3).map((member) => (
            <ProfileCard
              key={member.name}
              showIconPattern={false}
              showUserInfo={false}
              name={member.name}
              title={member.role}
              avatarUrl={member.imageUrl}
              className="about-profile-card"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
          {/* Second row - 2 columns */}
          {teamMembers.slice(3, 5).map((member) => (
            <ProfileCard
              key={member.name}
              showIconPattern={false}
              showUserInfo={false}
              name={member.name}
              title={member.role}
              avatarUrl={member.imageUrl}
              className="about-profile-card"
            />
          ))}
        </div>
      </section>

      {/* Supporters Section */}
      <section className="py-24">
        <h2 className="text-3xl md:text-5xl font-bold font-spartan text-center mb-12">
          Our Supporters
        </h2>
        <LogoLoop logos={logos} logoHeight={70} speed={80} />
      </section>
    </main>
  );
}
