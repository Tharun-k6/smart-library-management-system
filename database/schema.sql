-- Smart AI-Powered Library Management System
-- MySQL 8+

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS seat_reservations;
DROP TABLE IF EXISTS reading_history;
DROP TABLE IF EXISTS ebooks;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS fines;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS issued_books;
DROP TABLE IF EXISTS book_copies;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS system_settings;

CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  student_id VARCHAR(50) UNIQUE,
  employee_id VARCHAR(50) UNIQUE,
  phone VARCHAR(20),
  profile_image_url VARCHAR(255),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at TIMESTAMP NULL,
  role_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE TABLE authors (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  biography TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_authors_name (name)
) ENGINE=InnoDB;

CREATE TABLE publishers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_publishers_name (name)
) ENGINE=InnoDB;

CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE books (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  isbn VARCHAR(32) UNIQUE,
  author_id BIGINT,
  publisher_id BIGINT,
  category_id BIGINT,
  description TEXT,
  cover_image_url VARCHAR(255),
  quantity INT NOT NULL DEFAULT 1,
  available_copies INT NOT NULL DEFAULT 1,
  shelf_location VARCHAR(100),
  price DECIMAL(10,2) DEFAULT 0,
  digital_available BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_books_title (title),
  INDEX idx_books_isbn (isbn),
  INDEX idx_books_availability (available_copies),
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id),
  CONSTRAINT fk_books_publisher FOREIGN KEY (publisher_id) REFERENCES publishers(id),
  CONSTRAINT fk_books_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE book_copies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  book_id BIGINT NOT NULL,
  barcode VARCHAR(100) NOT NULL UNIQUE,
  qr_code_value VARCHAR(255),
  status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
  shelf_location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_book_copies_book FOREIGN KEY (book_id) REFERENCES books(id)
) ENGINE=InnoDB;

CREATE TABLE issued_books (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  book_copy_id BIGINT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE NULL,
  fine_amount DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'ISSUED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_issued_status (status),
  INDEX idx_issued_due_date (due_date),
  CONSTRAINT fk_issued_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_issued_book_copy FOREIGN KEY (book_copy_id) REFERENCES book_copies(id)
) ENGINE=InnoDB;

CREATE TABLE reservations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  queue_position INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reservations_status (status),
  CONSTRAINT fk_reservations_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_reservations_book FOREIGN KEY (book_id) REFERENCES books(id)
) ENGINE=InnoDB;

CREATE TABLE fines (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  issued_book_id BIGINT NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  reason VARCHAR(255),
  status VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_fines_status (status),
  CONSTRAINT fk_fines_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_fines_issued_book FOREIGN KEY (issued_book_id) REFERENCES issued_books(id)
) ENGINE=InnoDB;

CREATE TABLE payments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  fine_id BIGINT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_ref VARCHAR(100) UNIQUE,
  status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_payments_fine FOREIGN KEY (fine_id) REFERENCES fines(id)
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  read_status BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notifications_user (user_id),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE ebooks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  book_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  access_level VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
  file_size BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ebooks_book FOREIGN KEY (book_id) REFERENCES books(id)
) ENGINE=InnoDB;

CREATE TABLE reading_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  ebook_id BIGINT NOT NULL,
  pages_read INT DEFAULT 0,
  last_opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reading_history_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_reading_history_ebook FOREIGN KEY (ebook_id) REFERENCES ebooks(id)
) ENGINE=InnoDB;

CREATE TABLE seat_reservations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  seat_number VARCHAR(20) NOT NULL,
  time_slot VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'BOOKED',
  reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_seat_reservations_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  actor VARCHAR(150) NOT NULL,
  action VARCHAR(150) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id BIGINT,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_actor (actor),
  INDEX idx_audit_entity (entity_type, entity_id)
) ENGINE=InnoDB;

CREATE TABLE system_settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(150) NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO roles (name) VALUES ('ADMIN'), ('LIBRARIAN'), ('STUDENT');

INSERT INTO authors (name, biography) VALUES
('Robert C. Martin', 'Software engineer and author of Clean Code.'),
('Stuart Russell', 'AI researcher and author.'),
('Andrew S. Tanenbaum', 'Computer science professor and systems author.');

INSERT INTO publishers (name, address) VALUES
('Pearson', 'USA'),
('O''Reilly Media', 'USA'),
('McGraw Hill', 'USA');

INSERT INTO categories (name, description) VALUES
('Computer Science', 'Programming, algorithms, systems, and software engineering'),
('Artificial Intelligence', 'Machine learning, deep learning, and AI fundamentals'),
('Management', 'Business and leadership books');

INSERT INTO users (full_name, email, password, role_id, enabled, email_verified, otp_verified) VALUES
('Admin User', 'admin@smartlib.com', '$2a$10$Q5p3e7J0t0e9Q6Q2JdYQ2eV8W4mP4vF8P7rB6Jbq9zqKjS7R2mQW2', 1, TRUE, TRUE, TRUE),
('Librarian User', 'librarian@smartlib.com', '$2a$10$Q5p3e7J0t0e9Q6Q2JdYQ2eV8W4mP4vF8P7rB6Jbq9zqKjS7R2mQW2', 2, TRUE, TRUE, TRUE),
('Student User', 'student@smartlib.com', '$2a$10$Q5p3e7J0t0e9Q6Q2JdYQ2eV8W4mP4vF8P7rB6Jbq9zqKjS7R2mQW2', 3, TRUE, TRUE, TRUE);

INSERT INTO books (title, isbn, author_id, publisher_id, category_id, description, quantity, available_copies, shelf_location, price, digital_available) VALUES
('Clean Code', '9780132350884', 1, 1, 1, 'A handbook of agile software craftsmanship.', 12, 8, 'A1-12', 49.99, TRUE),
('Artificial Intelligence: A Modern Approach', '9780134610993', 2, 2, 2, 'Comprehensive introduction to AI.', 10, 5, 'B2-07', 79.99, TRUE),
('Operating System Concepts', '9781119456339', 3, 3, 1, 'Classic systems textbook.', 8, 3, 'C3-05', 69.99, FALSE),
('The Lean Startup', '9780307887894', 1, 1, 3, 'A modern entrepreneurship guide.', 15, 12, 'D4-08', 39.99, TRUE);

INSERT INTO book_copies (book_id, barcode, qr_code_value, status, shelf_location) VALUES
(1, 'BC-0001', 'QR-BOOK-1-0001', 'AVAILABLE', 'A1-12'),
(1, 'BC-0002', 'QR-BOOK-1-0002', 'ISSUED', 'A1-12'),
(2, 'BC-0003', 'QR-BOOK-2-0003', 'AVAILABLE', 'B2-07'),
(3, 'BC-0004', 'QR-BOOK-3-0004', 'AVAILABLE', 'C3-05');

INSERT INTO issued_books (user_id, book_copy_id, issue_date, due_date, return_date, fine_amount, status) VALUES
(3, 2, '2026-06-15', '2026-06-29', NULL, 0, 'ISSUED');

INSERT INTO reservations (user_id, book_id, reserved_at, expires_at, status, queue_position) VALUES
(3, 2, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY), 'ACTIVE', 1);

INSERT INTO fines (user_id, issued_book_id, amount, reason, status) VALUES
(3, 1, 25.00, 'Late return fee', 'UNPAID');

INSERT INTO payments (user_id, fine_id, amount, payment_method, transaction_ref, status) VALUES
(3, 1, 25.00, 'UPI', 'TXN-20260625-001', 'SUCCESS');

INSERT INTO notifications (user_id, title, message, type, read_status) VALUES
(3, 'Due Reminder', 'Your borrowed book is due soon.', 'DUE_REMINDER', FALSE),
(3, 'Reservation Confirmed', 'Your book reservation is now active.', 'RESERVATION', FALSE);

INSERT INTO ebooks (book_id, file_name, file_url, access_level, file_size) VALUES
(1, 'CleanCode.pdf', '/ebooks/clean-code.pdf', 'STUDENT', 2048576),
(2, 'AIMA.pdf', '/ebooks/aima.pdf', 'STUDENT', 7340032);

INSERT INTO reading_history (user_id, ebook_id, pages_read, last_opened_at) VALUES
(3, 1, 52, CURRENT_TIMESTAMP);

INSERT INTO seat_reservations (user_id, seat_number, time_slot, status) VALUES
(3, 'A-12', '10:00 AM - 12:00 PM', 'BOOKED');

INSERT INTO audit_logs (actor, action, entity_type, entity_id, details) VALUES
('system', 'SEED_DATA_INSERTED', 'DATABASE', 0, 'Initial schema and seed data loaded successfully');

INSERT INTO system_settings (setting_key, setting_value) VALUES
('library_name', 'Smart AI-Powered Library'),
('fine_per_day', '5'),
('reservation_expiry_hours', '48');

SET FOREIGN_KEY_CHECKS = 1;
