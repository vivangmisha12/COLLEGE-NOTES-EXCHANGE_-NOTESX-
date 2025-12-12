# 📚 College Notes Exchange (Full-Stack Project)

A full-stack platform for students to upload, download, rate, and manage college notes.  
Includes Admin Panel, User Dashboard, Ratings System, File Uploading, and Subject-based Filtering.

---

## 🚀 Features

### 👨‍🎓 User Features
- Register & Login  
- Upload Notes (PDF only)  
- View All Approved Notes  
- Preview PDF in Modal  
- Rate Notes (⭐ Rating System)  
- Search + Filter Notes  
- Subject-wise Notes Listing  
- My Notes Dashboard (View + Delete)  

---

### 🛡 Admin Features
- View All Users  
- Approve / Reject Notes  
- Delete Notes Permanently  
- Upload Notes as Admin  
- View Ratings (which user rated which note)  
- Check Analytics:
  - Total Users  
  - Total Notes  
  - Pending Approvals  

---

## 🏗 Tech Stack

### **Frontend**
- React.js  
- Axios  
- React Router  
- Context API  
- Modern UI (CSS + Animations)

### **Backend**
- Node.js  
- Express.js  
- Multer (File Uploading)  
- JWT Authentication  
- Bcrypt.js for Password Hashing  

### **Database**
- MySQL  
- mysql2 driver  

---

# 📁 Project Folder Structure
College-Notes-Exchange/
│
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── routes/
│ │ ├── utils/
│ │ ├── server.js
│ ├── uploads/
│ ├── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│
└── README.md

---

# ⚙️ Installation Guide

## 1️⃣ Backend Setup

### Step 1: Go to backend folder
cd backend  

###Step 2: Install dependencies
npm install

###Step 3: Setup .env file
PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=collegenotesdb

###Step 4: Start Backend Server
npm start

Backend will run at:
👉 http://localhost:5000


## 2️⃣ Frontend Setup
Step 1: Go to frontend folder
cd frontend

Step 2: Install dependencies
npm install

Step 3: Set Vite environment variables
Create .env:

VITE_API_URL=http://localhost:5000/api
VITE_FILE_BASE_URL=http://localhost:5000

Step 4: Start React app
npm run dev

Frontend will run at:
👉 http://localhost:5173



🗄 Database Setup (MySQL)

Run the following SQL:

Users Table----

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(200),
  branch VARCHAR(50),
  year INT,
  role ENUM('user','admin') DEFAULT 'user'
);

Notes Table----

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

Ratings Table----

CREATE TABLE ratings (
  rating_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  note_id INT,
  rating INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (note_id) REFERENCES notes(note_id)
);

Subjects Table----

CREATE TABLE subjects (
  subject_id INT AUTO_INCREMENT PRIMARY KEY,
  subject_name VARCHAR(200)
);


▶ How The System Works
Student Workflow-----

1.Register & Login
2.Upload Notes
3.Admin Approval Required
4.View notes
5.Rate Notes
6.Manage uploads in My Notes

Admin Workflow-----

1.Login as admin
2.Manage users
3.Approve or Reject notes
4.Upload verified notes
5.View ratings data
6.Delete any note permanently

📦 API Endpoints Overview
Auth
POST /api/auth/register
POST /api/auth/login

Notes
GET /api/notes
GET /api/notes/subjects
POST /api/notes/upload
POST /api/notes/rate
DELETE /api/notes/:id

Admin
GET /api/admin/users
GET /api/admin/notes
GET /api/admin/ratings
POST /api/admin/upload
PUT /api/admin/notes/:id/approve
DELETE /api/admin/notes/:id

🌐 Deployment Guide
Backend Deployment (Render.com)
1. Create new Web Service
2. Connect GitHub repo
3. Set Build Command: npm install
4. Set Start Command: npm start
5. Add Environment Variables from .env
6. Deploy

Frontend Deployment (Vercel)
1. Import GitHub repo
2. Select frontend folder
3. Set Build Command: npm run build
4. Set Output Directory: dist
5. Add VITE_API_URL (backend deployed URL)
6. Deploy

🤝 Contributing

Pull requests are welcome!
Feel free to fork the project and modify features.

📬 Contact
For any queries:
📧 vivangmishra@gmail.com





