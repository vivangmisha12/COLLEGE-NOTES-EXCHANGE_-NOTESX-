const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/* ✅ PROTECT ROUTES */
exports.protect = async (req, res, next) => {
  try {
    // ✅ Token missing
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    ) {
      return res.status(401).json({
        message: 'Not authorized, no token'
      });
    }

    // ✅ Extract token
    const token = req.headers.authorization.split(' ')[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user
    const [rows] = await pool.query(
      `
      SELECT user_id, name, email, branch, year, semester, role
      FROM users
      WHERE user_id = ?
      `,
      [decoded.user_id] // ✅ correct key
    );

    if (!rows.length) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    // ✅ Attach user once
    req.user = rows[0];

    next(); // ✅ CALL ONCE
  } catch (err) {
    console.error('JWT ERROR:', err.message);
    return res.status(401).json({
      message: 'Not authorized, token failed'
    });
  }
};

/* ✅ ADMIN CHECK */
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      message: 'Not authorized as admin'
    });
  }
};
