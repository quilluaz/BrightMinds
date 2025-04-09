import { useState } from "react";
import AnimatedCard from "./AnimatedCard";
import { useAuth } from "../contexts/AuthContext";

const UserSettings = ({ onClose }) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar || "👨‍🎓");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const avatarOptions = [
    "👨‍🎓",
    "👩‍🎓",
    "🧑‍🎓",
    "🦊",
    "🐱",
    "🐶",
    "🐼",
    "🐯",
    "🦁",
    "🐸",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would update the user's settings
    console.log("Updating user settings:", { name, email, password, avatar });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <AnimatedCard className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Account Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200">
            ✕
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div
                className="w-24 h-24 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-900 dark:to-blue-800 rounded-full mb-4 flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-300 shadow-lg"
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}>
                <span className="text-6xl">{avatar}</span>
              </div>
              <button
                type="button"
                className="text-blue-500 text-sm"
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}>
                Change Avatar
              </button>

              {showAvatarSelector && (
                <div className="mt-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 grid grid-cols-5 gap-2 animate-fadeIn">
                  {avatarOptions.map((avatarOption, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${
                        avatar === avatarOption
                          ? "bg-blue-100 dark:bg-blue-800 border-2 border-blue-500"
                          : "hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setAvatar(avatarOption);
                        setShowAvatarSelector(false);
                      }}>
                      <span className="text-2xl">{avatarOption}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-enhanced"
                placeholder="Your name"
              />
            </div>

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
                className="input-enhanced"
                placeholder="Your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-enhanced"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-enhanced"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default UserSettings;
