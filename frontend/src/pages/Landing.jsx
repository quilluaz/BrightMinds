import { useState, useMemo } from "react";
import img1 from "@/assets/games/01.webp";
import img2 from "@/assets/games/02.webp";
import img3 from "@/assets/games/03.webp";
import img4 from "@/assets/games/04.webp";
import GridMotion from "../components/background/GridMotion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Landing() {
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const baseImages = [img1, img2, img3, img4];

  const gridImages = Array.from({ length: 28 }, (_, i) => {
    const row = Math.floor(i / 7);
    const col = i % 7;

    const imgIndex = (col + row) % baseImages.length;
    return baseImages[imgIndex];
  });

  const start = () => {
    if (!started) {
      setStarted(true);
      setOpen(true);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full text-white overflow-hidden isolate"
      onClick={start}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && start()}
      role="button"
      tabIndex={0}>
      {/* Animated background + brand base color */}
      <div className="absolute inset-0 -z-10 bg-bmGreen">
        <GridMotion gradientColor="#3ea66b" items={gridImages} autoScroll />
      </div>

      {/* Blur overlay before start */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-all duration-700 ease-out ${
          started
            ? "backdrop-blur-0 bg-transparent"
            : "backdrop-blur-2xl bg-black/20"
        }`}
        aria-hidden
      />

      {/* Center prompt: logo + arcade text */}
      {!started && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="text-center select-none space-y-6">
            <div className="mx-auto flex items-center justify-center">
              <img
                src="/LogoIconStackLight.svg"
                alt="BrightMinds Logo"
                className="w-80 h-80 will-change-transform motion-safe:animate-float"
              />
            </div>

            {/* Arcade start text: orange fill with black outline */}
            <p
              className="
                text-[clamp(22px,3.5vw,34px)]
                font-black uppercase tracking-wide
                text-[#ff8e51]
                [text-shadow:_2px_2px_0_#000]
                [font-family:'Press_Start_2P',cursive]
              ">
              Click to Start
            </p>
          </div>
        </div>
      )}

      {/* Auth modal */}
      <Dialog
        open={open}
        onOpenChange={() => {
          /* keep open intentionally */
        }}>
        <DialogContent
          className="sm:max-w-md bg-bmLightYellow text-bmBlack border-4 border-bmBlack rounded-2xl shadow-[6px_6px_0_#000] [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}>
          {/* Capsule Switch */}
          <div className="w-full flex justify-center mb-4">
            <div className="inline-grid grid-cols-2 rounded-full border-2 border-bmBlack bg-bmYellow p-1 gap-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`px-4 py-2 rounded-full text-sm font-lexend font-semibold transition
                  ${
                    mode === "login"
                      ? "bg-bmOrange text-black shadow-md"
                      : "text-bmBlack hover:text-bmRed "
                  }`}
                aria-pressed={mode === "login"}>
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`px-4 py-2 rounded-full text-sm font-lexend font-semibold transition
                  ${
                    mode === "signup"
                      ? "bg-bmOrange text-black shadow-md"
                      : "text-bmBlack hover:text-bmRed"
                  }`}
                aria-pressed={mode === "signup"}>
                SIGNUP
              </button>
            </div>
          </div>

          <DialogHeader className="pb-2">
            {/* Modal title: keep Press Start 2P, use orange fill + black outline */}
            <DialogTitle
              className="
                text-center text-[2rem] leading-relaxed
                text-[#ff8e51]
                font-spartan font-black
                [-webkit-text-stroke:0.035em_black]
              ">
              {mode === "login" ? "Welcome back!" : "Welcome to BrightMinds!"}
            </DialogTitle>
          </DialogHeader>

          {/* Forms */}
          {mode === "login" ? (
            <div className="grid grid-cols-1 gap-3 font-lexend">
              <div className="grid gap-2">
                <Label htmlFor="login-email" className="text-bmBlack">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white border-2 border-bmBlack focus-visible:ring-0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="login-password" className="text-bmBlack">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-white border-2 border-bmBlack focus-visible:ring-0"
                />
              </div>
              <Button className="w-full mt-2 bg-bmYellow hover:bg-bmRed hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]">
                Sign in
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 font-lexend">
              <div className="grid gap-2">
                <Label htmlFor="signup-name" className="text-bmBlack">
                  Full name
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  className="bg-white border-2 border-bmBlack focus-visible:ring-0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-email" className="text-bmBlack">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white border-2 border-bmBlack focus-visible:ring-0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password" className="text-bmBlack">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  className="bg-white border-2 border-bmBlack focus-visible:ring-0"
                />
              </div>
              <Button className="w-full mt-2 bg-bmYellow hover:bg-bmRed hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]">
                Create account
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
