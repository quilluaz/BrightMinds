import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import BubbleMenu from "@/components/ui/BubbleMenu";
import api from "@/lib/api";

export default function GameMasterDashboard() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("bm_user")) || {};
    setUser(userData);
    if (userData.userId) {
      fetchStudents(userData.userId);
    }
  }, []);

  const fetchStudents = async (gameMasterId = null) => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors

      // Use provided gameMasterId or fall back to user.userId
      const gmId = gameMasterId || user?.userId;

      if (!gmId) {
        setError("Game Master ID not available");
        return;
      }

      console.log("Fetching students for Game Master ID:", gmId); // Debug log

      const response = await api.get("/gamemaster/students", {
        headers: {
          "X-GameMaster-Id": gmId.toString(),
        },
      });

      console.log("Students response:", response.data); // Debug log
      setStudents(response.data);
    } catch (e) {
      console.error("Error fetching students:", e); // Debug log
      setError(`Failed to fetch students: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      setError("Please select a file");
      return;
    }

    if (!user?.userId) {
      setError("Game Master ID not available");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      setLoading(true);
      setError(""); // Clear previous errors

      console.log("Uploading file for Game Master ID:", user.userId); // Debug log

      await api.post("/gamemaster/students/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-GameMaster-Id": user.userId.toString(),
        },
      });
      setSuccess("Students imported successfully!");
      setShowUploadModal(false);
      setUploadFile(null);
      fetchStudents(user.userId);
    } catch (e) {
      console.error("Error uploading file:", e); // Debug log
      setError(`Failed to upload file: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportStudents = async () => {
    if (!user?.userId) {
      setError("Game Master ID not available");
      return;
    }

    try {
      setLoading(true);
      setError(""); // Clear previous errors

      console.log("Exporting students for Game Master ID:", user.userId); // Debug log

      const response = await api.get("/gamemaster/students/export", {
        responseType: "blob",
        headers: {
          "X-GameMaster-Id": user.userId.toString(),
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error exporting students:", e); // Debug log
      setError(`Failed to export students: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    if (!user?.userId) {
      setError("Game Master ID not available");
      return;
    }

    try {
      setLoading(true);
      setError(""); // Clear previous errors

      console.log("Deleting student for Game Master ID:", user.userId); // Debug log

      await api.delete(`/gamemaster/student/${studentId}`, {
        headers: {
          "X-GameMaster-Id": user.userId.toString(),
        },
      });
      setSuccess("Student deleted successfully!");
      fetchStudents(user.userId);
    } catch (e) {
      console.error("Error deleting student:", e); // Debug log
      setError(`Failed to delete student: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-bmGreen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bmGreen text-bmBlack">
      <BubbleMenu />

      {/* Header */}
      <div className="bg-bmYellow border-b-4 border-bmBlack p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-spartan font-black [-webkit-text-stroke:0.035em_black] text-center text-bmBlack">
            GAME MASTER DASHBOARD
          </h1>
          <p className="text-center text-bmBlack font-lexend mt-2">
            Welcome, {user.fName} {user.lName}
          </p>
          <p className="text-center text-bmBlack font-lexend text-sm">
            Game Master ID: {user.userId} | Role: {user.role}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
            <CardHeader className="pb-2">
              <CardTitle className="text-bmBlack font-spartan font-bold text-center">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-spartan font-black text-center text-bmBlack">
                {students.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
            <CardHeader className="pb-2">
              <CardTitle className="text-bmBlack font-spartan font-bold text-center">
                Active Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-spartan font-black text-center text-bmBlack">
                {students.filter((s) => s.role === "PLAYER").length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
            <CardHeader className="pb-2">
              <CardTitle className="text-bmBlack font-spartan font-bold text-center">
                Game Masters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-spartan font-black text-center text-bmBlack">
                {students.filter((s) => s.role === "GAMEMASTER").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-bmYellow hover:bg-bmOrange hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
            disabled={loading}>
            Import Students
          </Button>
          <Button
            onClick={handleExportStudents}
            className="bg-bmYellow hover:bg-bmOrange hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
            disabled={loading}>
            Export Students
          </Button>
          <Button
            onClick={fetchStudents}
            className="bg-bmYellow hover:bg-bmOrange hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
            disabled={loading}>
            Refresh
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-bmRed text-white p-4 rounded-lg border-2 border-bmBlack text-center font-lexend">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-bmGreen text-white p-4 rounded-lg border-2 border-bmBlack text-center font-lexend">
            {success}
          </div>
        )}

        {/* Students List */}
        <Card className="bg-bmLightYellow border-4 border-bmBlack shadow-[6px_6px_0_#000]">
          <CardHeader>
            <CardTitle className="text-bmBlack font-spartan font-bold text-center text-2xl">
              Your Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-bmBlack font-lexend">
                Loading students...
              </div>
            ) : students.length === 0 ? (
              <div className="text-center text-bmBlack font-lexend">
                No students found. Import some students to get started!
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.userId}
                    className="bg-white border-2 border-bmBlack rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-spartan font-bold text-bmBlack">
                        {student.fName} {student.lName}
                      </h3>
                      <p className="font-lexend text-bmBlack">
                        {student.email}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-lexend font-bold ${
                          student.role === "GAMEMASTER"
                            ? "bg-bmOrange text-bmBlack"
                            : "bg-bmGreen text-white"
                        }`}>
                        {student.role}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDeleteStudent(student.userId)}
                        className="bg-bmRed hover:bg-red-700 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]"
                        disabled={loading}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md bg-bmLightYellow text-bmBlack border-4 border-bmBlack rounded-2xl shadow-[6px_6px_0_#000] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="font-spartan font-black [-webkit-text-stroke:0.035em_black] text-center text-bmBlack">
              Import Students
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 font-lexend">
            <div className="grid gap-2">
              <Label htmlFor="file" className="text-bmBlack">
                Excel File
              </Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="bg-white border-2 border-bmBlack focus-visible:ring-0"
              />
            </div>
            <div className="text-sm text-bmBlack bg-white p-3 rounded border-2 border-bmBlack">
              <strong>File Format:</strong>
              <br />
              Column 1: Email
              <br />
              Column 2: First Name
              <br />
              Column 3: Last Name
              <br />
              <br />
              <strong>Note:</strong> Students can only be created through this
              import feature. They cannot sign up themselves.
              <br />
              All imported students will have the default password:{" "}
              <strong>brightmindsplayer</strong>
            </div>
          </div>
          <DialogFooter className="mt-4 flex-col sm:flex-row">
            <Button
              onClick={() => setShowUploadModal(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-spartan font-bold border-2 border-bmBlack shadow-[2px_2px_0_#000]">
              Cancel
            </Button>
            <Button
              onClick={handleFileUpload}
              className="bg-bmYellow hover:bg-bmOrange hover:text-white text-bmBlack font-spartan font-bold border-2 border-bmBlack shadow-[4px_4px_0_#000]"
              disabled={loading || !uploadFile}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
