// frontend/src/pages/NotesList.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./NotesDashboard.css";

const NotesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const [previewPDF, setPreviewPDF] = useState(null);

  /* -------------------------- LOAD SUBJECTS + NOTES -------------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectsRes, notesRes] = await Promise.all([
          api.get("/notes/subjects"),
          api.get("/notes"),
        ]);

        setSubjects(subjectsRes.data);
        setNotes(notesRes.data);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /* -------------------- SUBJECT BOX CLICK → GO TO PAGE -------------------- */
  const openSubject = (sub) => {
    navigate(`/subject/${sub.subject_id}`, { state: { subject: sub } });
  };

  /* ------------------------- SUBJECT FILTER DROPDOWN ------------------------- */
  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);

    try {
      setLoading(true);
      const res = await api.get(
        subjectId ? `/notes?subjectId=${subjectId}` : "/notes"
      );
      setNotes(res.data);
    } catch (err) {
      console.error("Subject filter error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------ RATING LOGIC ------------------------------ */
  const handleRate = async (noteId, star) => {
    try {
      const res = await api.post("/notes/rate", {
        note_id: noteId,
        rating: star,
      });

      const newAvg = res.data.average_rating;

      setNotes((prev) =>
        prev.map((n) =>
          n.note_id === noteId ? { ...n, average_rating: newAvg } : n
        )
      );
    } catch (err) {
      console.error("Rating Error:", err);
      alert("Failed to submit rating");
    }
  };

  /* ------------------------------ SEARCH FILTER ----------------------------- */
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ------------------------------ SORTING TABS ------------------------------ */
  const processedNotes = [...filteredNotes].sort((a, b) => {
    if (activeTab === "top")
      return (b.average_rating || 0) - (a.average_rating || 0);

    if (activeTab === "latest")
      return new Date(b.created_at) - new Date(a.created_at);

    return 0;
  });

  if (loading)
    return <div className="dashboard-loading">Loading Notes Dashboard...</div>;

  return (
    <div className="dashboard fadeIn">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>📚 Notes Dashboard</h1>
          <p>{user.branch} • Year {user.year}</p>
        </div>

        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="🔍 Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={selectedSubject} onChange={handleSubjectChange}>
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.subject_id} value={s.subject_id}>
                {s.subject_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ------------------------ SUBJECT GRID (NEW) ------------------------ */}
      <section className="subject-grid-section">
        <h3>📘 Subjects</h3>

        <div className="subject-grid">
          {subjects.length === 0 ? (
            <div className="no-subjects">No subjects available</div>
          ) : (
            subjects.map((sub) => (
              <div
                key={sub.subject_id}
                className="subject-tile slideUp"
                onClick={() => openSubject(sub)}
              >
                <div className="subject-name">{sub.subject_name}</div>
                <div className="subject-meta">View notes →</div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ------------------------------- TABS ------------------------------- */}
      <div className="dashboard-tabs">
        {["all", "top", "latest"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active-tab" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "all" && "📄 All Notes"}
            {tab === "top" && "⭐ Top Rated"}
            {tab === "latest" && "🕒 Latest"}
          </button>
        ))}
      </div>

      {/* -------------------------- NOTES GRID -------------------------- */}
      <div className="notes-grid">
        {processedNotes.length > 0 ? (
          processedNotes.map((note) => (
            <div key={note.note_id} className="note-card slideUp">
              <div className="note-top">
                <h3>{note.title}</h3>
                <span className="subject-badge">{note.subject_name}</span>
              </div>

              <p className="note-desc">{note.description}</p>

              <div className="note-meta">
                <span>👤 {note.uploader_name}</span>
                <span>⭐ {Number(note.average_rating).toFixed(2)} / 5</span>
              </div>

              <button
                className="view-btn"
                onClick={() => setPreviewPDF(note.file_url)}
              >
                👁 View PDF
              </button>

              <div className="rating-bar">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(note.note_id, star)}
                    className="rating-star"
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-notes">No notes found</div>
        )}
      </div>

      {/* ----------------------- PDF PREVIEW MODAL ----------------------- */}
      {previewPDF && (
        <div className="modal-bg" onClick={() => setPreviewPDF(null)}>
          <div className="modal">
            <embed
              src={previewPDF}
              type="application/pdf"
              title="PDF Preview"
              className="pdf-frame"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;
