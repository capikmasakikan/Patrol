CREATE DATABASE IF NOT EXISTS security_patrol;
USE security_patrol;

CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guards (
    guard_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    shift VARCHAR(20),
    pin VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checkpoints (
    checkpoint_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nfc_tag_id VARCHAR(50) UNIQUE NOT NULL,
    checkpoint_name VARCHAR(100) NOT NULL,
    building VARCHAR(50),
    floor VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patrols (
    patrol_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    guard_id BIGINT NOT NULL,
    checkpoint_id BIGINT NOT NULL,
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (guard_id) REFERENCES guards(guard_id),
    FOREIGN KEY (checkpoint_id) REFERENCES checkpoints(checkpoint_id)
);