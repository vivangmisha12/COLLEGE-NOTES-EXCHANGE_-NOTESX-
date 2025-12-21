import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

/* Helper: convert academic year → semester */
const yearToSemester = (year) => {
  const yr = Number(year);
  if (![1, 2, 3, 4].includes(yr)) {
    throw new Error("Invalid academic year");
  }
  return yr * 2 - 1;  // 1→1, 2→3, 3→5, 4→7
};

/* ================= REGISTER ================= */
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, college, branch, year } = req.body;

    if (!name || !email || !password || !college || !branch || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const semester = yearToSemester(year);

    // Check if email exists
    const [existing] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
        semester,
      ]
    );

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Server error during registration",
    });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // MUST read from `users` table
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = users[0];

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        year: user.year,
        college: user.college
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
