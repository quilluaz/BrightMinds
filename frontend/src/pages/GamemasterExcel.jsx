import { useState, useRef } from "react";
import api from "@/lib/api";

function GamemasterExcel() {
  const [uploading, setUploading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("bm_user") || "null");
    } catch {
      return null;
    }
  })();

  const isGameMaster = user?.role === "GAMEMASTER";

  const onUpload = async () => {
    setMessage("");
    setError("");

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please choose an .xlsx file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      await api.post("/gamemaster/students/upload", formData);
      setMessage("Students imported successfully.");
      fileInputRef.current.value = "";
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onDownload = async () => {
    setMessage("");
    setError("");
    setDownloadLoading(true);
    try {
      const res = await api.get("/gamemaster/students/export", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      a.download = `students_${ts}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Download failed.");
    } finally {
      setDownloadLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold mb-2">GameMaster Excel Tester</h1>
          <p className="text-sm text-gray-600">Please log in first to continue.</p>
        </div>
      </main>
    );
  }

  if (!isGameMaster) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold mb-2">GameMaster Excel Tester</h1>
          <p className="text-sm text-red-600">Your account is not a GameMaster. Please use a GameMaster user.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">GameMaster Excel Tester</h1>
          <p className="text-sm text-gray-600 mt-1">Upload or download students via the original GameMaster endpoints.</p>
        </div>

        <section className="space-y-3">
          <label className="block text-sm font-medium">Upload Excel (.xlsx)</label>
          <input ref={fileInputRef} type="file" accept=".xlsx" className="block w-full" />
          <button
            onClick={onUpload}
            disabled={uploading}
            className="inline-flex items-center justify-center px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </section>

        <section className="space-y-3">
          <label className="block text-sm font-medium">Download Excel</label>
          <button
            onClick={onDownload}
            disabled={downloadLoading}
            className="inline-flex items-center justify-center px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          >
            {downloadLoading ? "Preparing..." : "Download"}
          </button>
        </section>

        <section className="space-y-1">
          {message ? <p className="text-sm text-green-700">{message}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </section>

        <section className="text-xs text-gray-500">
          <p>Expected columns (first sheet, header row is skipped):</p>
          <ul className="list-disc ml-5">
            <li>First Name</li>
            <li>Last Name</li>
            <li>Email</li>
            <li>Password</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

export default GamemasterExcel;



