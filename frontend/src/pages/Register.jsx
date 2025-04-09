"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import AnimatedCard from "../components/AnimatedCard";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, error, loading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(
        user.role === "STUDENT" ? "/student-dashboard" : "/teacher-dashboard"
      );
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
    setIsLoading(true);
    await register(email, password, role);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center confetti-bg p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <AnimatedCard className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="mb-4 float">
            <img
              src="/logoicon.svg"
              alt="BrightMinds Logo"
              className="h-11 mx-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23FDDF7D' /%3E%3Ctext x='50' y='55' fontFamily='Arial' fontSize='20' textAnchor='middle' fill='%23464655'%3EBM%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            BrightMinds
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create your account
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md animate-pulse">
            <p>{error}</p>
          </div>
        )}

        {passwordError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md animate-pulse">
            <p>{passwordError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-enhanced"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-enhanced"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-enhanced"
              placeholder="Confirm your password"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center ${
                  role === "STUDENT"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}>
                <span className="text-2xl mb-2">👨‍🎓</span>
                <span
                  className={`font-medium ${
                    role === "STUDENT"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}>
                  Student
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center ${
                  role === "TEACHER"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400"
                    : "border-gray-200 dark:border-gray-700"
                }`}>
                <span className="text-2xl mb-2">👨‍🏫</span>
                <span
                  className={`font-medium ${
                    role === "TEACHER"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}>
                  Teacher
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isLoading}
            className="btn-primary w-full flex justify-center items-center">
            {loading || isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium">
              Login
            </Link>
          </p>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default Register;
