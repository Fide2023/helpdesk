DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS upload;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS knowledge;


CREATE TABLE ticket
(
    id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(50),
    user VARCHAR(50),
    user_email VARCHAR(255),
    category VARCHAR(20),
    description TEXT,
    status char (6) DEFAULT 'open',
    agent VARCHAR(50) DEFAULT 'unclaimed',
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_update DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE upload
(
    id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    ticket_id int NOT NULL,
    path VARCHAR(255),
    filename VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    FOREIGN KEY (ticket_id) REFERENCES ticket(id)
);

CREATE TABLE user
(
    id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    picture VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE category
(
    id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
    category VARCHAR(255)
);

CREATE TABLE comment
(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    ticket_id INT,
    comment VARCHAR(255),
    user VARCHAR(255),
    commented_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES ticket(id)
);

CREATE TABLE knowledge
(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    ticket_id INT,
    problem TEXT,
    solution TEXT,
    agent VARCHAR(50),
    posted_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES ticket(id)
);