import pool from '../config/db.js';
import path from 'path';
import fs from 'fs';



/* ✅ GET SUBJECTS */
export const getSubjects = async (req, res) => {
  try {
    let query, params;

    if (req.user.role === 'admin') {
      // Admin can see all subjects
      query = `SELECT subject_id, subject_name FROM subjects`;
      params = [];
    } else {
      // Regular users see subjects for their branch/semester
      const { branch, semester } = req.user;
      query = `SELECT subject_id, subject_name
               FROM subjects
               WHERE LOWER(branch)=LOWER(?) AND semester=?`;
      params = [branch, semester];
    }

    const [subjects] = await pool.query(query, params);
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
};

/* ✅ UPLOAD NOTE */
export const uploadNote = async (req, res) => {
  try {
    const { title, description, subject_id } = req.body;
    const { user_id, branch, year, semester } = req.user;

    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    // Validate subject exists (admins can upload to any subject)
    let subjectCheckQuery, subjectCheckParams;
    if (req.user.role === 'admin') {
      subjectCheckQuery = `SELECT subject_id FROM subjects WHERE subject_id=?`;
      subjectCheckParams = [subject_id];
    } else {
      subjectCheckQuery = `SELECT subject_id FROM subjects
                          WHERE subject_id=? AND LOWER(branch)=LOWER(?) AND semester=?`;
      subjectCheckParams = [subject_id, branch, semester];
    }

    const [subjectCheck] = await pool.query(subjectCheckQuery, subjectCheckParams);

    if (!subjectCheck.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Invalid subject' });
    }

    const file_url = `/uploads/notes/${req.file.filename}`;
    
    const [result] = await pool.query(
      `INSERT INTO notes
       (title, description, file_url, file_type, subject_id, uploaded_by, batch_year, approved)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, file_url, 'pdf', subject_id, user_id, year, 0]
    );

    res.status(201).json({
      message: 'Uploaded successfully (awaiting approval)',
      note_id: result.insertId
    });
  } catch (err) {
    console.error(err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Upload failed' });
  }
};

/* ✅ GET NOTES */
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
    WHERE n.approved=1 AND (LOWER(s.branch)=LOWER(?) AND n.batch_year=? OR u.role='admin')
  `;
  const params = [branch, year];

  if (subjectId) {
    query += ' AND n.subject_id=?';
    params.push(subjectId);
  }

  query += ' GROUP BY n.note_id ORDER BY n.created_at DESC';

  const [rows] = await pool.query(query, params);
  res.json(rows);
};

/* ✅ MY NOTES */
export const getMyNotes = async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user_id = req.user.user_id;

    const [rows] = await pool.query(
      `
      SELECT n.*, s.subject_name
      FROM notes n
      JOIN subjects s ON n.subject_id = s.subject_id
      WHERE n.uploaded_by = ?
      ORDER BY n.created_at DESC
      `,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch your notes' });
  }
};



/* ✅ RATE NOTE */
export const rateNote = async (req, res) => {
  const { note_id, rating } = req.body;
  const user_id = req.user.user_id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating 1–5 required" });
  }

  try {
    // Insert or update rating
    await pool.query(
      `INSERT INTO ratings (note_id, user_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
      [note_id, user_id, rating]
    );

    // Get updated average
    const [[avg]] = await pool.query(
      `SELECT AVG(rating) AS avg_rating FROM ratings WHERE note_id = ?`,
      [note_id]
    );

    res.json({
      message: "Rating saved",
      average_rating: avg.avg_rating
    });
  } catch (err) {
    console.error("RATE ERROR:", err);
    res.status(500).json({ message: "Rating failed" });
  }
};


/* ✅ ADMIN APPROVE */
export const approveNote = async (req, res) => {
  await pool.query(
    'UPDATE notes SET approved=? WHERE note_id=?',
    [req.body.approved, req.params.id]
  );
  res.json({ message: 'Status updated' });
};

/* ✅ UPDATE NOTE */
export const updateNote = async (req, res) => {
  const { title, description } = req.body;

  const [result] = await pool.query(
    `UPDATE notes SET title=?, description=?
     WHERE note_id=? AND uploaded_by=?`,
    [title, description, req.params.id, req.user.user_id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: 'Not authorized' });
  }

  res.json({ message: 'Updated successfully' });
};

/* ✅ DELETE NOTE */
export const deleteNote = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT file_url FROM notes
     WHERE note_id=? AND uploaded_by=?`,
    [req.params.id, req.user.user_id]
  );

  if (!rows.length) return res.status(404).json({ message: 'Not found' });

  await pool.query(
    `DELETE FROM notes WHERE note_id=?`,
    [req.params.id]
  );

  if (rows[0].file_url?.startsWith('/uploads')) {
    const fullPath = `.${rows[0].file_url}`;
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }

  res.json({ message: 'Deleted successfully' });
};

/* ✅ ADMIN DELETE NOTE */
export const deleteNoteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // get file path of note
    const [rows] = await pool.query(
      `SELECT file_url FROM notes WHERE note_id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Note not found" });
    }

    const filePath = rows[0].file_url;

    // delete DB record
    await pool.query(`DELETE FROM notes WHERE note_id = ?`, [id]);

    // remove file from uploads
    if (filePath && filePath.startsWith('/uploads')) {
      const fullPath = `.${filePath}`;
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    res.json({ message: "Note deleted by admin" });
  } catch (err) {
    console.error("ADMIN DELETE ERROR:", err);
    res.status(500).json({ message: "Failed to delete note" });
  }
};

/* ✅ ADMIN UPLOAD NOTE (auto-approved) */
export const uploadNoteAdmin = async (req, res) => {
  try {
    const { title, description, subject_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }

    // Validate subject exists (admins can upload to any subject)
    const [subjectCheck] = await pool.query(`SELECT subject_id FROM subjects WHERE subject_id=?`, [subject_id]);
    if (!subjectCheck.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Invalid subject' });
    }

    const file_url = `/uploads/notes/${req.file.filename}`;

    const [result] = await pool.query(
      `INSERT INTO notes
       (title, description, file_url, file_type, subject_id, uploaded_by, batch_year, approved)
       VALUES (?, ?, ?, 'pdf', ?, ?, ?, 1)`,
      [title, description || null, file_url, subject_id, req.user.user_id, req.user.year || null]
    );

    res.status(201).json({
      message: 'Admin note uploaded & auto-approved!',
      note_id: result.insertId
    });
  } catch (err) {
    console.error('Admin Upload Error:', err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Admin upload failed' });
  }
};
