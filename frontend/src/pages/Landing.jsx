import { useState } from "react";
import { login, signup } from "@/services/auth";
import GridMotion from "../components/background/GridMotion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";

export default function Landing() {
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupFname, setSignupFname] = useState("");
  const [signupLname, setSignupLname] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseImages = [
    "https://res.cloudinary.com/dymjwplal/image/upload/v1758651667/story1_landing.png",
    "https://res.cloudinary.com/dymjwplal/image/upload/s1_scene9_rkvlnl.jpg",
    "https://res.cloudinary.com/dymjwplal/image/upload/s1_scene3zeke_jx5kso.png",
  ];

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

  async function handleLogin() {
    setLoading(true);
    setError("");

    // Basic validation
    if (!loginEmail.trim() || !loginPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      await login({ email: loginEmail, password: loginPassword });
      window.location.href = "/home";
    } catch (e) {
      setError(
        e?.message ||
          "Login failed. Please check your credentials or try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    setLoading(true);
    setError("");

    // Basic validation
    if (
      !signupFname.trim() ||
      !signupLname.trim() ||
      !signupEmail.trim() ||
      !signupPassword
    ) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const signupData = {
        fName: signupFname.trim(),
        lName: signupLname.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      };
      await signup(signupData);
      window.location.href = "/home";
    } catch (e) {
      setError(
        e?.message || "Signup failed. Please review inputs or try again."
      );
    } finally {
      setLoading(false);
    }
  }

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

          {/* Error display */}
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

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
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleLogin();
                    }
                  }}
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
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleLogin();
                    }
                  }}
                />
              </div>
              <Button
                className="w-full mt-2 bg-bmYellow hover:bg-bmRed hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
                onClick={handleLogin}
                disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 font-lexend">
              <div className="grid gap-2">
                <Label htmlFor="signup-fname" className="text-bmBlack">
                  First Name
                </Label>
                <Input
                  id="signup-fname"
                  type="text"
                  placeholder="Juan"
                  className="bg-white border-2 border-bmBlack focus-visible:ring-0"
                  value={signupFname}
                  onChange={(e) => setSignupFname(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-lname" className="text-bmBlack">
                  Last Name
                </Label>
                <Input
                  id="signup-lname"
                  type="text"
                  placeholder="Dela Cruz"
                  className="bg-white border-2 border-bmBlack focus-visible:ring-0"
                  value={signupLname}
                  onChange={(e) => setSignupLname(e.target.value)}
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
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSignup();
                    }
                  }}
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
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>
              <Button
                className="w-full mt-2 bg-bmYellow hover:bg-bmRed hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
                onClick={handleSignup}
                disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
