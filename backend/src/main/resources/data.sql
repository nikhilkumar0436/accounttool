-- This file will be executed on application startup if spring.jpa.hibernate.ddl-auto is set to 'create' or 'create-drop'
-- For testing purposes, you can manually insert a default admin user

-- Note: The password 'admin123' should be encoded using BCrypt
-- BCrypt hash for 'admin123': $2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6

INSERT INTO users (username, password, email, full_name, role, active, created_at, updated_at)
VALUES ('admin', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'admin@accounttool.com', 'System Administrator', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;
