/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  // ⬇️ include ts/tsx too so classes are generated from those files
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        // BrightMinds palette
        bmGreen: "#3ea66b",
        bmYellow: "#ffd83f",
        bmLightYellow: "#fffbe0",
        bmOrange: "#ff8e51",
        bmRed: "#ff6953",
        bmMagenta: "#feb0e1",
        bmIndigo: "#9c8bef",
        bmBlack: "#000000",
      },
      fontFamily: {
        spartan: ["'League Spartan'", "sans-serif"],
        lexend: ["'Lexend Deca'", "sans-serif"],
        pressStart: ["'Press Start 2P'", "cursive"],
      },

      // ⬇️ New: floating animation
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" }, // adjust amplitude here
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-slow": "float 4s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
