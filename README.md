📚 College Notes Exchange (Full-Stack Project)

A full-stack Notes Sharing Platform built for college students to upload, download, rate, and manage study materials.
Includes Admin Panel, User Dashboard, Ratings System, and Subject-based Notes Filtering.

🚀 Features
👨‍🎓 User Features

Register & Login

Upload Notes (PDF)

View All Approved Notes

Rating System (⭐)

Search & Filter Notes

Subject-wise Notes Listing

Personal Notes Dashboard (My Notes)

Delete Uploaded Notes

PDF Preview Modal

🛡 Admin Features

Approve / Reject Notes

View All Users

Subject Filters

View Ratings (Who rated what)

Upload Notes as Admin

Delete Notes Permanently

Analytics:

Total users

Total notes

Pending approvals

🏗 Tech Stack
Frontend

React.js

Axios

React Router

Context API (Auth)

Custom CSS (Dashboard Themes)

Backend

Node.js

Express.js

Multer (File Uploads)

JWT Authentication

Bcrypt Password Hashing

Database

MySQL

mysql2 (ORM Layer)

📁 Project Structure
College Notes Exchange Project/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
└── README.md

⚙️ Installation & Setup
1️⃣ Backend Setup
Go to backend folder:
cd backend

Install dependencies:
npm install

Set environment variables:

Create a .env file inside backend:

PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=collegenotesdb

Start server:
npm start


Backend will run on:
👉 http://localhost:5000

2️⃣ Frontend Setup
Go to frontend folder:
cd frontend

Install dependencies:
npm install

Set API URL:

Create or edit .env:

VITE_API_URL=http://localhost:5000/api
VITE_FILE_BASE_URL=http://localhost:5000

Start frontend:
npm run dev


Frontend will run on:
👉 http://localhost:5173

🗄 Database Setup (MySQL)

Run these tables:

Users Table
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(200),
  branch VARCHAR(50),
  year INT,
  role ENUM('user','admin') DEFAULT 'user'
);

Notes Table
CREATE TABLE notes (
  note_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  subject_id INT,
  description TEXT,
  file_url VARCHAR(255),
  uploader_id INT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(user_id)
);

Ratings Table
CREATE TABLE ratings (
  rating_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  note_id INT,
  rating INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (note_id) REFERENCES notes(note_id)
);

▶ How to Use the System
👨‍🎓 For Students

Register → Login

Upload note (PDF only)

Wait for admin approval

View notes

Rate notes

Check your uploads inside My Notes

🛡 For Admin

Login with admin account

Approve/Reject notes

Upload verified notes

Check ratings and users

Delete any note permanently

🤝 Contributing

Contributions are welcome!
Just fork the repo → make changes → open a pull request.

📬 Contact

For queries, contact:
📧 vivangmishra@gmail.com
