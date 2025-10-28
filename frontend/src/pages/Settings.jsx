import React, { useState } from "react";
import BubbleMenu from "@/components/ui/BubbleMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import api from "@/lib/api";

export default function Settings() {
  const initialUser = JSON.parse(localStorage.getItem("bm_user")) || {};
  const [user, setUser] = useState(initialUser);

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handlePasswordInputChange = (e) => {
    const { id, value } = e.target;
    setPasswordData({ ...passwordData, [id]: value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    try {
      const res = await api.put(`/users/${user.userId}`, payload);

      const updatedUser = {
        ...user,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
      };
      setUser(updatedUser);
      localStorage.setItem("bm_user", JSON.stringify(updatedUser));

      setLoading(false);
      setSuccess("Profile updated successfully!");
    } catch (e) {
      setLoading(false);
      setError(e.message || "An error occurred while updating the profile.");
    }
  };

  const handlePasswordSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Authenticate with old password
      const loginRequest = {
        email: user.email,
        password: passwordData.oldPassword,
      };
      await api.post("/auth/login", loginRequest);

      // 2. Update the password if the old password is correct
      const updateRequest = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: passwordData.newPassword,
      };

      const res = await api.put(`/users/${user.userId}`, updateRequest);

      const updatedUser = {
        ...user,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
      };
      setUser(updatedUser);
      localStorage.setItem("bm_user", JSON.stringify(updatedUser));

      setLoading(false);
      setSuccess("Password updated successfully!");
      setIsPasswordModalOpen(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (e) {
      setLoading(false);
      setError(e.message || "Invalid old password or an error occurred.");
    }
  };

  return (
    <main className="relative min-h-screen bg-bmGreen text-bmBlack">
      <BubbleMenu />
      <section className="h-screen overflow-hidden grid place-items-center w-full p-4 md:p-8">
        <div className="w-full max-w-2xl">
          <Card className="w-full rounded-2xl border-4 border-bmYellow shadow-2xl bg-bmLightYellow">
            <CardHeader className="text-center">
              <CardTitle
                className="text-[clamp(22px,3.5vw,34px)] font-black uppercase tracking-wide
                  text-[#ff8e51] [text-shadow:_2px_2px_0_#000] [font-family:'Press_Start_2P',cursive]">
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 border-2 border-green-500 text-green-700 p-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="space-y-2 font-lexend">
                  <Label htmlFor="firstName" className="text-bmBlack">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-white border-2 border-bmBlack focus-visible:ring-0 font-lexend"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2 font-lexend">
                  <Label htmlFor="lastName" className="text-bmBlack">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-white border-2 border-bmBlack focus-visible:ring-0 font-lexend"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2 font-lexend">
                  <Label htmlFor="email" className="text-bmBlack">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white border-2 border-bmBlack focus-visible:ring-0 font-lexend"
                    disabled={loading}
                  />
                </div>

                <div className="flex justify-end pt-2 space-x-4">
                  <Button
                    type="button"
                    className="bg-bmYellow hover:bg-bmGreen hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
                    onClick={() => setIsPasswordModalOpen(true)}
                    disabled={loading}>
                    Change Password
                  </Button>
                  <Button
                    type="submit"
                    className="bg-bmYellow hover:bg-bmGreen hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
                    disabled={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Password Change Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md bg-bmLightYellow text-bmBlack border-4 border-bmBlack rounded-2xl shadow-[6px_6px_0_#000] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="font-spartan font-black [-webkit-text-stroke:0.035em_black] text-center text-[#ff8e51]">
              Change Password
            </DialogTitle>
            <DialogDescription className="text-center text-bmBlack">
              Enter your current password and new password to update your
              account
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 font-lexend">
            <div className="grid gap-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                type="password"
                placeholder="Enter current password"
                className="bg-white border-2 border-bmBlack focus-visible:ring-0 font-lexend"
                value={passwordData.oldPassword}
                onChange={handlePasswordInputChange}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className="bg-white border-2 border-bmBlack focus-visible:ring-0 font-lexend"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex-col sm:flex-row">
            <Button
              type="button"
              className="w-full sm:w-auto bg-bmYellow hover:bg-bmRed hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
              onClick={handlePasswordSave}
              disabled={loading}>
              Update Password
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto border-bmBlack text-bmBlack hover:bg-gray-200 font-spartan"
                onClick={() =>
                  setPasswordData({ oldPassword: "", newPassword: "" })
                }
                disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
