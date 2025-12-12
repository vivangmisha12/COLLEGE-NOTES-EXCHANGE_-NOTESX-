const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/notes',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF allowed'));
  }
});

module.exports = upload;
