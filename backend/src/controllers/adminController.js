const pool = require('../config/db');

// Get all registered users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT user_id, name, email, branch, year, semester, role, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(users);
  } catch (err) {
    console.error("ADMIN USERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
exports.getAllNotes = async (req, res) => {
  try {
    const [notes] = await pool.query(`
      SELECT n.*, 
             s.subject_name,
             u.name AS uploader_name,
             u.email AS uploader_email
      FROM notes n
      JOIN subjects s ON s.subject_id = n.subject_id
      JOIN users u ON u.user_id = n.uploaded_by
      ORDER BY n.created_at DESC
    `);

    res.json(notes);
  } catch (err) {
    console.error("ADMIN NOTES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch notes list" });
  }
};
exports.getAllRatings = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.rating_id,
        r.rating,
        n.title AS note_title,
        u.name AS user_name,
        u.email AS user_email
      FROM ratings r
      JOIN notes n ON n.note_id = r.note_id
      JOIN users u ON u.user_id = r.user_id
      ORDER BY r.rating_id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.log("ADMIN RATING ERROR:", err);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};
