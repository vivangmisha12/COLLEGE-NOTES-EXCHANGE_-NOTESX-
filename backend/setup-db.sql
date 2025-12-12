-- Active: 1765215918062@@127.0.0.1@3306@collegenotesdb
-- setup-db.sql

-- 1. users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Increased length for bcrypt hash
    college VARCHAR(100) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    year INT NOT NULL, -- e.g., 2024 for batch year
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_branch_year (branch, year),
    INDEX idx_role (role)
);

-- 2. subjects table
CREATE TABLE subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) UNIQUE NOT NULL,
    branch VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    UNIQUE (subject_name, branch, semester)
);

-- 3. notes table
CREATE TABLE notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(255), -- Stores path for Multer uploads or external link
    file_type ENUM('pdf', 'doc', 'link') NOT NULL,
    subject_id INT NOT NULL,
    uploaded_by INT NOT NULL,
    batch_year INT NOT NULL, -- Stored explicitly for easy filtering/archiving
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id),
    INDEX idx_subject (subject_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_access (batch_year, approved)
);

-- 4. ratings table (composite UNIQUE key ensures a user rates a note only once)
CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    note_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(note_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    UNIQUE KEY unique_user_note (user_id, note_id)
);

-- Initial Admin (Set up a strong password hash manually or through an admin registration)
INSERT INTO users (name, email, password_hash, college, branch, year, role) 
VALUES ('System Admin', 'admin@college.edu', '$2b$10$...YOUR_HASH...', 'Admin College', 'ALL', 0, 'admin');

-- Sample Subjects
INSERT INTO subjects (subject_name, branch, semester) VALUES
('Data Structures', 'CS', 3),
('Thermodynamics', 'ME', 4),
('Signals & Systems', 'EC', 5);




ALTER TABLE ratings 
ADD UNIQUE KEY unique_rating (note_id, user_id);


UPDATE notes SET approved = 1 WHERE uploaded_by =<admin_user_id>;