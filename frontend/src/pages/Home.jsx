import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BubbleMenu from "@/components/ui/BubbleMenu";
import RollingGallery from "@/components/ui/RollingGallery";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null); // { id, title, img, desc }

  const games = useMemo(
    () => [
      {
        id: "g1",
        title: "The Story of the Amulet",
        img: "https://res.cloudinary.com/dymjwplal/image/upload/story1_landing_kxgk4k.png",
        desc: "Embark on a story-driven civics adventure about community helpers. Pause for questions to progress.",
      },
      {
        id: "g2",
        title: "Kasaysayan Run (Story 2)",
        img: "https://res.cloudinary.com/dymjwplal/image/upload/s1_scene9_rkvlnl.jpg",
        desc: "Discover key moments in Philippine history through an interactive, gamified storyline.",
      },
      {
        id: "g3",
        title: "Science Quest (Story 3)",
        img: "https://res.cloudinary.com/dymjwplal/image/upload/s1_scene3zeke_jx5kso.png",
        desc: "Learn about basic science through puzzles and branching story paths.",
      },
      {
        id: "g4",
        title: "Math Dash (Story 4)",
        img: "https://res.cloudinary.com/dymjwplal/image/upload/s1_scene1zeke_hxe84n.png",
        desc: "Sharpen math skills through arcade-style gamified lessons.",
      },
    ],
    []
  );

  const images = useMemo(() => games.map((g) => g.img), [games]);

  const handleItemClick = ({ url }) => {
    const idx = games.findIndex((g) => g.img === url);
    const selected = games[(idx + games.length) % games.length];
    setActive(selected);
    setOpen(true);
  };

  const goPlay = () => {
    // Dummy navigation for now
    navigate("/play/beta");
  };

  return (
    <main className="relative min-h-screen bg-bmGreen">
      {/* Top nav / bubble menu */}
      <BubbleMenu />

      {/* Viewport section (no page scrollbars) */}
      <section className="h-screen overflow-hidden grid place-items-center w-full">
        <div className="gallery-trap w-full flex items-center justify-center">
          <div className="w-full max-w-7xl px-0 flex items-center justify-center">
            <RollingGallery
              images={images}
              autoplay
              pauseOnHover
              rotationSpeed={40}
              containerClass="w-full flex items-center justify-center"
              onItemClick={handleItemClick}
              scrollFactor={0.12}
              dragFactor={0.05}
              tileTo={8}
              ringSpread={2.2}
              fitToViewport
              verticalPadding={120}
            />
          </div>
        </div>
      </section>

      {/* Game Info Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl bg-bmLightYellow text-bmBlack">
          <DialogHeader>
            <DialogTitle className="font-['League_Spartan'] text-2xl md:text-3xl">
              {active?.title ?? "Game Info"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Game details
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.2fr]">
            {/* Left: image */}
            <div className="flex items-center justify-center">
              {active?.img && (
                <img
                  src={active.img}
                  alt={active.title}
                  className="max-h-[260px] w-full max-w-[360px] rounded-xl border-2 border-bmYellow object-cover"
                />
              )}
            </div>

            {/* Right: description */}
            <div className="space-y-3">
              <p className="font-['Lexend_Deca'] leading-relaxed">
                {active?.desc ?? "Select a game to view its details."}
              </p>

              <ul className="list-disc pl-5 text-sm opacity-90">
                <li>Linear chapter unlocking</li>
                <li>Auto-save after each question</li>
                <li>Voice-over narration</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              className="bg-bmYellow text-bmBlack hover:opacity-90"
              onClick={goPlay}>
              Play now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
