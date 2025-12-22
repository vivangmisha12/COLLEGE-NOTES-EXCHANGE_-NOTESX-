import pool from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

/* ================= GET SUBJECTS ================= */
export const getSubjects = async (req, res) => {
  try {
    let query, params;

    if (req.user.role === "admin") {
      query = `SELECT subject_id, subject_name FROM subjects`;
      params = [];
    } else {
      const { branch, semester } = req.user;
      query = `
        SELECT subject_id, subject_name
        FROM subjects
        WHERE LOWER(branch)=LOWER(?) AND semester=?
      `;
      params = [branch, semester];
    }

    const [subjects] = await pool.query(query, params);
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
};

/* ================= UPLOAD NOTE (USER) ================= */
export const uploadNote = async (req, res) => {
  try {
    const { title, description, subject_id } = req.body;
    const { user_id, branch, year, semester, role } = req.user;

    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    // ✅ Validate subject
    let query, params;
    if (role === "admin") {
      query = `SELECT subject_id FROM subjects WHERE subject_id=?`;
      params = [subject_id];
    } else {
      query = `
        SELECT subject_id FROM subjects
        WHERE subject_id=? AND LOWER(branch)=LOWER(?) AND semester=?
      `;
      params = [subject_id, branch, semester];
    }

    const [subjectCheck] = await pool.query(query, params);
    if (!subjectCheck.length) {
      return res.status(400).json({ message: "Invalid subject" });
    }

    // 🔥 CLOUDINARY BASE64 UPLOAD (RENDER SAFE)
    const base64File = req.file.buffer.toString("base64");

    const uploadResult = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${base64File}`,
      {
        folder: "college_notes",
        resource_type: "raw",
      }
    );

    const file_url = uploadResult.secure_url;
    const public_id = uploadResult.public_id;

    await pool.query(
      `
      INSERT INTO notes
      (title, description, file_url, cloudinary_id, file_type, subject_id, uploaded_by, batch_year, approved)
      VALUES (?, ?, ?, ?, 'pdf', ?, ?, ?, 0)
      `,
      [
        title,
        description || null,
        file_url,
        public_id,
        subject_id,
        user_id,
        year,
      ]
    );

    res.status(201).json({
      message: "Uploaded successfully (awaiting approval)",
      file_url,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err.message, err);
    
    // Cloudinary configuration error
    if (err.message && err.message.includes("Authentication")) {
      return res.status(500).json({ 
        message: "Cloudinary not configured properly. Check API credentials." 
      });
    }
    
    // File size error
    if (err.message && err.message.includes("file size")) {
      return res.status(413).json({ 
        message: "File size exceeds 200MB limit" 
      });
    }
    
    res.status(500).json({ 
      message: "Upload failed", 
      error: err.message 
    });
  }
};

/* ================= GET NOTES ================= */
export const getNotes = async (req, res) => {
  const { branch, year } = req.user;
  const { subjectId } = req.query;

  let query = `
    SELECT n.*, s.subject_name, u.name uploader_name,
    COALESCE(AVG(r.rating),0) avg_rating
    FROM notes n
    JOIN subjects s ON n.subject_id=s.subject_id
    JOIN users u ON u.user_id=n.uploaded_by
    LEFT JOIN ratings r ON r.note_id=n.note_id
    WHERE n.approved=1
      AND (LOWER(s.branch)=LOWER(?) AND n.batch_year=? OR u.role='admin')
  `;

  const params = [branch, year];

  if (subjectId) {
    query += " AND n.subject_id=?";
    params.push(subjectId);
  }

  query += " GROUP BY n.note_id ORDER BY n.created_at DESC";

  const [rows] = await pool.query(query, params);
  res.json(rows);
};

/* ================= MY NOTES ================= */
export const getMyNotes = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const [rows] = await pool.query(
      `
      SELECT n.*, s.subject_name
      FROM notes n
      JOIN subjects s ON n.subject_id=s.subject_id
      WHERE n.uploaded_by=?
      ORDER BY n.created_at DESC
      `,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your notes" });
  }
};

/* ================= UPDATE NOTE ================= */
export const updateNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user_id = req.user.user_id;
    const note_id = req.params.id;

    const [result] = await pool.query(
      `
      UPDATE notes
      SET title=?, description=?
      WHERE note_id=? AND uploaded_by=?
      `,
      [title, description || null, note_id, user_id]
    );

    if (!result.affectedRows) {
      return res.status(403).json({ message: "Not authorized or note not found" });
    }

    res.json({ message: "Note updated successfully" });
  } catch (err) {
    console.error("UPDATE NOTE ERROR:", err);
    res.status(500).json({ message: "Failed to update note" });
  }
};

/* ================= RATE NOTE ================= */
export const rateNote = async (req, res) => {
  const { note_id, rating } = req.body;
  const user_id = req.user.user_id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating 1–5 required" });
  }

  try {
    await pool.query(
      `
      INSERT INTO ratings (note_id, user_id, rating)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE rating=VALUES(rating)
      `,
      [note_id, user_id, rating]
    );

    const [[avg]] = await pool.query(
      `SELECT AVG(rating) AS avg_rating FROM ratings WHERE note_id=?`,
      [note_id]
    );

    res.json({ message: "Rating saved", average_rating: avg.avg_rating });
  } catch (err) {
    console.error("RATE ERROR:", err);
    res.status(500).json({ message: "Rating failed" });
  }
};

/* ================= DELETE NOTE (USER) ================= */
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;

  const [rows] = await pool.query(
    `SELECT cloudinary_id FROM notes WHERE note_id=? AND uploaded_by=?`,
    [id, user_id]
  );

  if (!rows.length) return res.status(404).json({ message: "Not found" });

  if (rows[0].cloudinary_id) {
    await cloudinary.uploader.destroy(rows[0].cloudinary_id, {
      resource_type: "raw",
    });
  }

  await pool.query(`DELETE FROM notes WHERE note_id=?`, [id]);
  res.json({ message: "Deleted successfully" });
};

/* ================= ADMIN APPROVE ================= */
export const approveNote = async (req, res) => {
  await pool.query(
    `UPDATE notes SET approved=? WHERE note_id=?`,
    [req.body.approved, req.params.id]
  );
  res.json({ message: "Status updated" });
};

/* ================= ADMIN DELETE ================= */
export const deleteNoteAdmin = async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `SELECT cloudinary_id FROM notes WHERE note_id=?`,
    [id]
  );

  if (!rows.length) return res.status(404).json({ message: "Not found" });

  if (rows[0].cloudinary_id) {
    await cloudinary.uploader.destroy(rows[0].cloudinary_id, {
      resource_type: "raw",
    });
  }

  await pool.query(`DELETE FROM notes WHERE note_id=?`, [id]);
  res.json({ message: "Note deleted by admin" });
};
/* ================= ADMIN UPLOAD NOTE ================= */
export const uploadNoteAdmin = async (req, res) => {
  try {
    const { title, description, subject_id } = req.body;
    const admin_id = req.user.user_id;

    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    // Validate subject
    const [subjectCheck] = await pool.query(
      `SELECT subject_id FROM subjects WHERE subject_id=?`,
      [subject_id]
    );

    if (!subjectCheck.length) {
      return res.status(400).json({ message: "Invalid subject" });
    }

    // 🔥 CLOUDINARY UPLOAD (RENDER SAFE)
    const uploadResult = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "college_notes",
        resource_type: "auto",
        timeout: 600000, // ✅ 10 minutes (large file safety)
      }
    );

    await pool.query(
      `
      INSERT INTO notes
      (title, description, file_url, cloudinary_id, file_type, subject_id, uploaded_by, batch_year, approved)
      VALUES (?, ?, ?, ?, 'pdf', ?, ?, NULL, 1)
      `,
      [
        title,
        description || null,
        uploadResult.secure_url,
        uploadResult.public_id,
        subject_id,
        admin_id,
      ]
    );

    res.status(201).json({
      message: "Admin note uploaded & auto-approved",
      file_url: uploadResult.secure_url,
    });
  } catch (err) {
    console.error("ADMIN UPLOAD ERROR:", err);
    res.status(500).json({ message: "Admin upload failed" });
  }
};
