"use client"
import { useTheme } from "../contexts/ThemeContext"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-yellow-100 dark:from-gray-700 dark:to-gray-800 transition-all duration-300 transform hover:scale-110 shadow-md"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <MoonIcon className="w-5 h-5 text-gray-700" />
      ) : (
        <SunIcon className="w-5 h-5 text-yellow-300" />
      )}
    </button>
  )
}

export default ThemeToggle
