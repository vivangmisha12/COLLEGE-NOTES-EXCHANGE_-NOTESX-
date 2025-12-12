import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("users");

  // Search / Filter States
  const [userSearch, setUserSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [noteSearch, setNoteSearch] = useState("");

  // Admin Upload States
  const [adminTitle, setAdminTitle] = useState("");
  const [adminSubject, setAdminSubject] = useState("");
  const [adminDescription, setAdminDescription] = useState("");
  const [adminFile, setAdminFile] = useState(null);

  // ---------------- LOAD ALL ADMIN DATA ----------------
  useEffect(() => {
    const load = async () => {
      try {
        const usersRes = await api.get("/admin/users");
        const notesRes = await api.get("/admin/notes");
        const ratingsRes = await api.get("/admin/ratings");
        const subjectsRes = await api.get("/admin/subjects");

        setUsers(usersRes.data);
        setNotes(notesRes.data);
        setRatings(ratingsRes.data);
        setSubjects(subjectsRes.data);
      } catch (err) {
        console.error("ADMIN LOAD ERROR:", err);
      }
      setLoading(false);
    };
    load();
  }, []);

  // ---------------- APPROVE / REJECT NOTE ----------------
  const approveNote = async (id, value) => {
    try {
      await api.put(`/admin/notes/${id}/approve`, { approved: value });

      setNotes((prev) =>
        prev.map((n) => (n.note_id === id ? { ...n, approved: value } : n))
      );
    } catch (err) {
      console.error("APPROVE ERROR:", err);
    }
  };

  // ---------------- ADMIN UPLOAD ----------------
  const handleAdminUpload = async (e) => {
    e.preventDefault();

    if (!adminFile) return alert("Please choose a PDF file");

    try {
      const fd = new FormData();
      fd.append("title", adminTitle);
      fd.append("subject_id", adminSubject);
      fd.append("description", adminDescription);
      fd.append("file", adminFile);

      await api.post("/admin/upload", fd);

      alert("Upload Successful!");

      // Reset fields
      setAdminTitle("");
      setAdminSubject("");
      setAdminDescription("");
      setAdminFile(null);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Upload failed");
    }
  };

  if (loading) return <h2>Loading Admin Panel...</h2>;

  // ---------------- FILTER USERS ----------------
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());

    const matchBranch = branchFilter ? u.branch === branchFilter : true;
    const matchYear = yearFilter ? u.year == yearFilter : true;

    return matchSearch && matchBranch && matchYear;
  });

  // ---------------- FILTER NOTES ----------------
  const filteredNotes = notes.filter((n) =>
    (n.title + n.subject_name + n.uploader_name)
      .toLowerCase()
      .includes(noteSearch.toLowerCase())
  );

  return (
    <div className="admin-dashboard">

      <h1>📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">👥 Users: {users.length}</div>
        <div className="stat-card">📄 Notes: {notes.length}</div>
        <div className="stat-card">
          ⏳ Pending: {notes.filter((n) => !n.approved).length}
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {["users", "notes", "ratings", "upload"].map((tab) => (
          <button
            key={tab}
            className={activeSection === tab ? "active-tab" : ""}
            onClick={() => setActiveSection(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ---------------- USERS SECTION ---------------- */}
      {activeSection === "users" && (
        <>
          <h2>👥 Registered Users</h2>

          <div className="filter-row">
            <input
              placeholder="Search user..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />

            <select onChange={(e) => setBranchFilter(e.target.value)}>
              <option value="">All Branches</option>
              <option value="IT">IT</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
            </select>

            <select onChange={(e) => setYearFilter(e.target.value)}>
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.branch}</td>
                  <td>{u.year}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ---------------- NOTES SECTION ---------------- */}
      {activeSection === "notes" && (
        <>
          <h2>📄 Uploaded Notes</h2>

          <input
            className="search-notes"
            placeholder="Search notes..."
            value={noteSearch}
            onChange={(e) => setNoteSearch(e.target.value)}
          />

          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Uploader</th>
                <th>Status</th>
                <th>Preview</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredNotes.map((n) => (
                <tr key={n.note_id}>
                  <td>{n.title}</td>
                  <td>{n.subject_name}</td>
                  <td>{n.uploader_name}</td>
                  <td>{n.approved ? "✔ Approved" : "⏳ Pending"}</td>

                  <td>
                    <a href={`http://localhost:5000${n.file_url}`} target="_blank">
                      View
                    </a>
                  </td>

                  <td>
                    {!n.approved ? (
                      <button
                        className="approve-btn"
                        onClick={() => approveNote(n.note_id, true)}
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        className="reject-btn"
                        onClick={() => approveNote(n.note_id, false)}
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ---------------- RATINGS SECTION ---------------- */}
      {activeSection === "ratings" && (
        <>
          <h2>⭐ User Ratings</h2>

          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Note</th>
                <th>Rating</th>
              </tr>
            </thead>

            <tbody>
              {ratings.map((r) => (
                <tr key={r.rating_id}>
                  <td>{r.user_name}</td>
                  <td>{r.user_email}</td>
                  <td>{r.note_title}</td>
                  <td>⭐ {r.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ---------------- ADMIN UPLOAD SECTION ---------------- */}
      {activeSection === "upload" && (
        <div className="admin-upload-wrapper panel-animate">

          <h2 className="section-heading">📤 Upload Notes (Admin)</h2>
          <p className="section-sub">Upload verified material directly to platform</p>

          <div className="admin-upload-card">
            <form onSubmit={handleAdminUpload} className="admin-upload-form">

              <input
                type="text"
                className="admin-input"
                placeholder="Note Title"
                required
                value={adminTitle}
                onChange={(e) => setAdminTitle(e.target.value)}
              />

              <select
                className="admin-input"
                required
                value={adminSubject}
                onChange={(e) => setAdminSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.subject_name}
                  </option>
                ))}
              </select>

              <textarea
                className="admin-textarea"
                placeholder="Short description..."
                value={adminDescription}
                onChange={(e) => setAdminDescription(e.target.value)}
              />

              <div className="upload-file-box">
                <label className="upload-label">
                  <strong>📄 Choose PDF</strong>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="file-hidden-input"
                    onChange={(e) => setAdminFile(e.target.files[0])}
                    required
                  />
                </label>

                <span className="file-name">
                  {adminFile ? adminFile.name : "No file chosen"}
                </span>
              </div>

              <button className="upload-btn-admin">Upload Note</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
