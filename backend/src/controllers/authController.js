const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/* ✅ Helper: calculate semester from year */
const yearToSemester = (year) => {
  const yr = Number(year);

  // Safety validation
  if (![1, 2, 3, 4].includes(yr)) {
    throw new Error('Invalid academic year');
  }

  // Year 1 → 1, Year 2 → 3, Year 3 → 5, Year 4 → 7
  return yr * 2 - 1;
};

/* ================= REGISTER ================= */
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, college, branch, year } = req.body;

    // ✅ Strict validation
    if (!name || !email || !password || !college || !branch || !year) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Convert + calculate semester safely
    const semester = yearToSemester(year);

    // ✅ Check existing user
    const [existing] = await db.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert user
    await db.query(
      `
      INSERT INTO users
      (name, email, password_hash, college, branch, year, semester)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        email.toLowerCase(),
        hashedPassword,
        college,
        branch,
        Number(year),
        semester
      ]
    );

    res.status(201).json({
      message: 'User registered successfully'
    });

  } catch (err) {
    console.error('REGISTER ERROR:', err.message);
    res.status(500).json({ message: err.message || 'Server error during registration' });
  }
};

/* ================= LOGIN ================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email & password required' });
    }

    // ✅ Fetch user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!users.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // ✅ Match password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    /* ✅ JWT PAYLOAD (VERY IMPORTANT) */
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        branch: user.branch,
        year: user.year,
        semester: user.semester
      },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '1d' }
    );

    // ✅ Send complete user so frontend works everywhere
    res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        year: user.year,
        semester: user.semester,
        role: user.role
      }
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = {
  registerStudent,
  loginUser
};
