import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import "./AdminUpload.css";

const AdminUpload = () => {
  const [form, setForm] = useState({
    title: "",
    subject_id: "",
    description: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  /************************************
      LOAD SUBJECTS (ADMIN)
  ************************************/
  useEffect(() => {
    api.get("/admin/subjects")
      .then((res) => setSubjects(res.data))
      .catch(() => setSubjects([]));
  }, []);

  /************************************
      FILE HANDLER
  ************************************/
  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") return alert("Only PDF allowed!");

    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  /************************************
      SUBMIT HANDLER
  ************************************/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please attach a PDF file");
    if (!form.title || !form.subject_id)
      return alert("Title and Subject are required");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("subject_id", form.subject_id);
    fd.append("description", form.description);
    fd.append("file", file);

    setLoading(true);

    try {
      await api.post("/admin/upload", fd);
      alert("Uploaded successfully!");

      setForm({ title: "", subject_id: "", description: "" });
      setFile(null);
      setPreviewUrl("");
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-upload-page dashboard-bg">
      <div className="admin-upload-card slideUp">
        <h2>📤 Admin Note Upload</h2>
        <span className="muted">Upload verified notes directly to the platform</span>

        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <input
            className="input"
            name="title"
            placeholder="Note Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          {/* SUBJECT */}
          <select
            className="input"
            name="subject_id"
            value={form.subject_id}
            onChange={(e) =>
              setForm({ ...form, subject_id: e.target.value })
            }
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.subject_id} value={s.subject_id}>
                {s.subject_name}
              </option>
            ))}
          </select>

          {/* DESCRIPTION */}
          <textarea
            className="textarea"
            name="description"
            placeholder="Short description..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          ></textarea>

          {/* DROP ZONE */}
          <div
            className="drop-zone"
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            {file ? (
              <b>📄 {file.name}</b>
            ) : (
              "Click or drag PDF file here"
            )}
          </div>

          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="application/pdf"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {/* PDF PREVIEW */}
          {previewUrl && (
            <div className="pdf-preview fadeIn">
              <iframe title="Preview" src={previewUrl}></iframe>
            </div>
          )}

          {/* BUTTON */}
          <button className="btn primary" disabled={loading}>
            {loading ? "Uploading..." : "Upload Note"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUpload;
