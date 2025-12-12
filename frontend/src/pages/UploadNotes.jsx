import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import "./UploadNotes.css";

const UploadNotes = () => {
  const [form, setForm] = useState({ title: "", subject_id: "", description: "" });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    api.get("/notes/subjects")
      .then(res => setSubjects(res.data || []))
      .catch(() => setSubjects([]));
  }, []);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") return showToast("Only PDF allowed", "err");

    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    showToast("PDF selected", "ok");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.subject_id) return showToast("Fill all fields", "err");
    if (!file) return showToast("Attach a PDF", "err");

    setLoading(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("subject_id", form.subject_id);
    fd.append("description", form.description);
    fd.append("file", file);

    try {
      await api.post("/notes/upload", fd);
      showToast("Uploaded successfully 🎉", "ok");

      setForm({ title: "", subject_id: "", description: "" });
      setFile(null);
      setPreviewUrl("");
    } catch (err) {
      showToast("Upload failed", "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-wrapper dashboard-bg">
      <div className="upload-card panel-animate">

        <h2>📤 Upload Notes</h2>
        <p className="muted">Share notes with classmates — PDF only</p>

        <form onSubmit={handleSubmit} className="upload-form">
          <input
            className="input"
            name="title"
            placeholder="Note Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <select
            className="input"
            name="subject_id"
            value={form.subject_id}
            onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.subject_id} value={s.subject_id}>
                {s.subject_name}
              </option>
            ))}
          </select>

          <textarea
            className="textarea"
            placeholder="Short description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div
            className="drop-zone"
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          >
            {file ? `📄 ${file.name}` : "Drag & Drop PDF or Click to Select"}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {previewUrl && (
            <div className="pdf-preview">
              <iframe src={previewUrl} title="Preview" />
            </div>
          )}

          <button className="btn primary" disabled={loading}>
            {loading ? "Uploading..." : "Upload Note"}
          </button>
        </form>

        {toast && (
          <div className={`toast ${toast.type === "ok" ? "ok" : "err"}`}>
            {toast.msg}
          </div>
        )}

      </div>
    </div>
  );
};

export default UploadNotes;
