import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./NotesUploadStyles.css";

const ConfirmModal = ({ open, title, onConfirm, onClose }) => {
  if (!open) return null;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="confirm-modal panel-animate" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="muted">This action will permanently delete the selected note.</p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/notes/mine");
        setNotes(res.data || []);
      } catch (err) {
        console.error("MyNotes load:", err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onDelete = (id) => setConfirm({ open: true, id });

  const confirmDelete = async () => {
    const id = confirm.id;
    setConfirm({ open: false, id: null });
    try {
      await api.delete(`/notes/${id}`);
      setNotes((p) => p.filter((n) => n.note_id !== id));
      showToast("Deleted successfully", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Delete failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="my-notes-page dashboard-bg">
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="my-notes-page dashboard-bg">
      <div className="page-head">
        <h2>📁 My Uploaded Notes</h2>
        <p className="muted">Manage, preview and delete your uploads</p>
      </div>

      {notes.length === 0 ? (
        <div className="empty-panel panel-animate">
          <h3>No uploads yet</h3>
          <p className="muted">Upload notes from the Upload page to share with classmates.</p>
        </div>
      ) : (
        <div className="my-notes-grid">
          {notes.map((note) => (
            <div key={note.note_id} className="my-note-card panel-animate">
              <div className="card-top">
                <h4 className="note-title">{note.title}</h4>
                <div className={`status ${note.approved ? "approved" : "pending"}`}>
                  {note.approved ? "Approved" : "Pending"}
                </div>
              </div>

              <div className="note-subject muted">{note.subject_name}</div>
              <div className="card-actions">
                <a className="btn outline" href={`http://localhost:5000${note.file_url}`} target="_blank" rel="noreferrer">View</a>
                <button className="btn danger" onClick={() => onDelete(note.note_id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirm.open}
        title="Delete this note?"
        onConfirm={confirmDelete}
        onClose={() => setConfirm({ open: false, id: null })}
      />

      {toast && <div className={`toast ${toast.type === "error" ? "err" : toast.type === "success" ? "ok" : ""}`}>{toast.msg}</div>}
    </div>
  );
};

export default MyNotes;
