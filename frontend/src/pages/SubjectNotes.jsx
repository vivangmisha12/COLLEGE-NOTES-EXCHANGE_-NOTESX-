// frontend/src/pages/SubjectNotes.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api/axios";
import "./SubjectNotes.css";

const SubjectNotes = () => {
  const { id } = useParams();
  const location = useLocation();
  const subjectData = location.state?.subject;

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewPDF, setPreviewPDF] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await api.get(`/notes?subjectId=${id}`);
        setNotes(res.data);
      } catch (err) {
        console.error("Subject Notes Error:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    loadNotes();
  }, [id]);

  /* ---------------- RATING SYSTEM ---------------- */
  const handleRate = async (noteId, rating) => {
    try {
      const res = await api.post("/notes/rate", { note_id: noteId, rating });
      const newAvg = res.data.average_rating;

      setNotes((prev) =>
        prev.map((n) => (n.note_id === noteId ? { ...n, average_rating: newAvg } : n))
      );
    } catch (err) {
      console.error("Rating Error:", err);
    }
  };

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="subject-loading">Loading notes...</div>;

  return (
    <div className="subject-page fadeIn">

      {/* HEADER */}
      <div className="subject-header">
        <div>
          <h1>📘 {subjectData?.subject_name || "Subject Notes"}</h1>
          <p className="muted">
            All notes uploaded under this subject
          </p>
        </div>

        <input
          className="subject-search"
          placeholder="🔍 Search notes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* NOTES GRID */}
      <div className="subject-notes-grid">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div key={note.note_id} className="subject-note-card slideUp">
              <h3>{note.title}</h3>
              <p className="note-desc">{note.description}</p>

              <div className="meta">
                <span>👤 {note.uploader_name}</span>
                <span>⭐ {Number(note.average_rating).toFixed(2)}</span>
              </div>

              <button
                className="view-btn"
                onClick={() => setPreviewPDF(note.file_url)}
              >
                View PDF
              </button>

              <div className="rating-bar">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="rating-star"
                    onClick={() => handleRate(note.note_id, star)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-notes fadeIn">No notes found for this subject.</div>
        )}
      </div>

      {/* PDF MODAL */}
      {previewPDF && (
        <div className="modal-bg" onClick={() => setPreviewPDF(null)}>
          <div className="modal">
            <iframe
              src={previewPDF}
              title="PDF Preview"
              className="pdf-frame"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectNotes;
