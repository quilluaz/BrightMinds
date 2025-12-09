import { useState, useRef, useEffect } from "react";
import BubbleMenu from "@/components/ui/BubbleMenu";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";
import ProfileCard from "@/components/ui/ProfileCard/ProfileCard";
import CircularProfile from "@/components/ui/CircularProfile/CircularProfile";
import LogoLoop from "@/components/ui/LogoLoop";
import CountUp from "@/components/ui/CountUp";

const teamMembers = [
  {
    name: "Isaac Quilo",
    role: "Lead Developer",
    imageUrl:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1765295488/Pixel_Art_Character_Cream_Hoodie_Transparent_qquz7b.png",
  },
  {
    name: "Ezekiel Saludsod",
    role: "Team Lead",
    imageUrl:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1765295480/zeke_kh9rox.png",
  },
  {
    name: "Selina Genosolango",
    role: "Frontend Lead",
    imageUrl:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1765295482/sel_ovyzll.png",
  },
  {
    name: "Jeric Melocoton",
    role: "Backend Lead",
    imageUrl:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1765299007/jeric_p9kt2y.png",
  },
  {
    name: "Justin Labajos",
    role: "Full Stack Dev",
    imageUrl:
      "https://res.cloudinary.com/dymjwplal/image/upload/v1765298865/lex_d1vwev.png",
  },
];

const logos = [
  { src: "/css_logo.svg" },
  { src: "/cit_logo.svg" }
];

const SECTION_IMAGES = {
  hero: "https://res.cloudinary.com/dymjwplal/image/upload/v1765300155/uploaded_image_1765300154709_t9j8z9.png", // Using the user's uploaded image as placeholder/example
  stats: "https://res.cloudinary.com/dymjwplal/image/upload/v1765303367/team_sjyipn.png",
  why: {
    gamified: "", // Add URL here
    story: "", // Add URL here
    community: "https://res.cloudinary.com/dymjwplal/image/upload/v1765303365/why2_t8gjjz.jpg",
  }
};

const supporters = {
  adviser: {
    name: "Dr. Leah V. Barbaso",
    role: "Adviser",
    imageUrl: "https://res.cloudinary.com/dymjwplal/image/upload/v1765304722/maamleah_uahavl.png",
  },
  teachers: [
    {
      name: "Teacher Chiesa B. Zaldarriaga",
      role: "Consultant",
      imageUrl: "https://res.cloudinary.com/dymjwplal/image/upload/v1765304724/teacherchiesa_jacitz.png",
    },
    {
      name: "Teacher Riza M. Montayre",
      role: "Consultant and Facilitator",
      imageUrl: "https://res.cloudinary.com/dymjwplal/image/upload/v1765304732/teachrizaa_kzj4i3.png",
    },
  ],
};

export default function About() {
  const [scrollStackCompleted, setScrollStackCompleted] = useState(false);

  const handleScrollStackComplete = () => {
    console.log("ScrollStack animation completed");
    setScrollStackCompleted(true);
    // Removed forced scroll - let user scroll naturally
  };

  return (
    <main className="relative text-white">
      <BubbleMenu useFixedPosition={true} />

      {/* Hero Section - Align Left + Circle Image Holder */}
      <section className="w-full bg-bmGreen pt-48 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="md:w-1/2 text-left">
              <h1 className="text-4xl md:text-6xl font-bold font-spartan mb-6">
                About BrightMinds
              </h1>
              <p className="text-lg md:text-xl font-lexend leading-relaxed">
                BrightMinds is an interactive learning platform designed to make
                education engaging and fun for students of all ages. Our mission
                is to combine compelling storytelling with educational content
                to create an unforgettable learning experience.
              </p>
            </div>
            {/* Circle Image Holder */}
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden border-4 border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center relative">
                {SECTION_IMAGES.hero ? (
                   <img src={SECTION_IMAGES.hero} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white/50 font-spartan text-xl">
                    Image Placeholder
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why BrightMinds? Section - Split Left/Right */}
      <section className="w-full bg-bmYellow text-bmBlack py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold font-spartan text-center mb-16">
            Why BrightMinds?
          </h2>
          <div className="flex flex-col gap-24">
            {/* ROW 1: Gamified Learning - Image Left, Text Right */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Image - Left on Desktop */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                <div className="w-full max-w-[500px] h-[300px] rounded-[3rem] bg-black/20 backdrop-blur-sm border-4 border-white/30 overflow-hidden relative shadow-xl">
                  <img 
                    src={SECTION_IMAGES.why.gamified || "/images/about/why_1.jpg"} 
                    alt="Gamified Learning" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Text - Right on Desktop */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h3 className="text-2xl font-bold font-spartan mb-4">
                  Gamified Learning
                </h3>
                <p className="font-lexend text-lg leading-relaxed">
                  We believe that learning shouldn't be a chore. By integrating
                  game mechanics, rewards, and interactive challenges, we
                  transform complex subjects into exciting adventures that
                  students want to conquer.
                </p>
              </div>
            </div>

            {/* ROW 2: Story-Driven Education - Text Left, Image Right */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 flex justify-center md:justify-end md:order-2">
                 <div className="w-full max-w-[500px] h-[300px] rounded-[3rem] bg-black/20 backdrop-blur-sm border-4 border-white/30 overflow-hidden relative shadow-xl">
                  <img 
                    src={SECTION_IMAGES.why.story || "/images/about/why_2.jpg"} 
                    alt="Story-Driven Education" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 text-center md:text-right md:order-1">
                <h3 className="text-2xl font-bold font-spartan mb-4">
                  Story-Driven Education
                </h3>
                <p className="font-lexend text-lg leading-relaxed md:ml-auto">
                  Facts are easier to remember when they're part of a story. Our
                  platform weaves educational concepts into immersive narratives,
                  giving context to knowledge and helping students understand the
                  "why" behind the "what".
                </p>
              </div>
            </div>

            {/* ROW 3: Community & Collaboration - Image Left, Text Right */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Image - Left on Desktop */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                 <div className="w-full max-w-[500px] h-[300px] rounded-[3rem] bg-black/20 backdrop-blur-sm border-4 border-white/30 overflow-hidden relative shadow-xl">
                  <img 
                    src={SECTION_IMAGES.why.community || "/images/about/why_3.jpg"} 
                    alt="Community & Collaboration" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Text - Right on Desktop */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h3 className="text-2xl font-bold font-spartan mb-4">
                  Community & Collaboration
                </h3>
                <p className="font-lexend text-lg leading-relaxed">
                  Learning is better together. We foster a supportive community
                  where students can share achievements, collaborate on projects,
                  and inspire each other to reach new heights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporters Section - Align Center */}
      <section className="w-full bg-bmOrange py-24 text-white">
        <div className="container mx-auto px-4 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-spartan">
              Our Supporters
            </h2>
          </div>

          <div className="flex flex-col gap-24 max-w-5xl mx-auto">
            {/* Adviser Row - Image Left, Text Right */}
            <div className="flex flex-col md:flex-row items-center gap-12 justify-center">
               <div className="w-[300px] md:w-[350px] aspect-[3/4] bg-black/20 backdrop-blur-sm border-4 border-white/30 rounded-2xl overflow-hidden shadow-xl">
                  {supporters.adviser.imageUrl ? (
                    <img 
                      src={supporters.adviser.imageUrl} 
                      alt={supporters.adviser.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 font-spartan">Image</div>
                  )}
               </div>
               <div className="text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-bold font-spartan mb-2">{supporters.adviser.name}</h3>
                  <p className="text-xl md:text-2xl font-lexend text-white/90">{supporters.adviser.role}</p>
               </div>
            </div>

            {/* Teachers Row - 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 justify-items-center">
              {supporters.teachers.map((teacher, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-[300px] md:w-[350px] aspect-[3/4] bg-black/20 backdrop-blur-sm border-4 border-white/30 rounded-2xl overflow-hidden shadow-xl mb-8">
                     {teacher.imageUrl ? (
                        <img 
                          src={teacher.imageUrl} 
                          alt={teacher.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/50 font-spartan">Image</div>
                      )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold font-spartan mb-2">{teacher.name}</h3>
                  <p className="text-lg md:text-xl font-lexend text-white/90">{teacher.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <LogoLoop logos={logos} logoHeight={250} speed={50} />
      </section>

      {/* Animated Stats Section - Align Left + Rect Image Holder */}
      <section className="w-full bg-bmRed py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text and Stats - Left */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold font-spartan mb-12">
                Our Journey in Numbers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center md:justify-items-start">
                <div>
                  <CountUp end={15000} suffix="+" />
                  <p className="font-spartan font-bold text-lg">Lines of Code</p>
                </div>
                <div>
                  <CountUp end={500} suffix="+" />
                  <p className="font-spartan font-bold text-lg">Hours of Development</p>
                </div>
                <div>
                  <CountUp end={100} suffix="+" />
                  <p className="font-spartan font-bold text-lg">Cups of Coffee</p>
                </div>
              </div>
            </div>
            {/* Rounded Rect Image Holder - Right */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="w-full max-w-[500px] h-[300px] rounded-[3rem] bg-black/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden relative">
                 {SECTION_IMAGES.stats ? (
                   <img src={SECTION_IMAGES.stats} alt="Stats" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white/50 font-spartan text-xl">
                    Image Placeholder
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Minds Section - Centered + Circular Profiles */}
      <section className="w-full bg-bmIndigo py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold font-spartan text-center mb-16">
            Meet the Minds
          </h2>
          <div className="flex flex-col items-center gap-16 max-w-6xl mx-auto">
            {/* First row - 3 columns on Desktop, 1 on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full justify-items-center">
              {teamMembers.slice(0, 3).map((member) => (
                <CircularProfile
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  imageUrl={member.imageUrl}
                />
              ))}
            </div>
            {/* Second row - 2 columns on Desktop, 1 on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full justify-items-center max-w-4xl">
              {teamMembers.slice(3, 5).map((member) => (
                <CircularProfile
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  imageUrl={member.imageUrl}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}
