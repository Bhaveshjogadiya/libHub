-- LibHub MySQL subsystem migration
-- MySQL owns contact/support messages only. MongoDB remains the source of truth
-- for users, books, inventory, loans, reservations and fines. No dual-writing.
CREATE DATABASE IF NOT EXISTS libhub_support CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE libhub_support;
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new','in_progress','resolved') NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contact_status_created (status, created_at),
  INDEX idx_contact_email (email)
) ENGINE=InnoDB;
