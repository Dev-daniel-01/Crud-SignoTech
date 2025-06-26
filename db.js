import mysql from "mysql"

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dandev123",
    database: "crud",
});

// polls (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     start_date DATETIME NOT NULL,
//     end_date DATETIME NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// ); 
//     options (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     poll_id INT NOT NULL,
//     text VARCHAR(255) NOT NULL,
//     votes INT DEFAULT 0,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
// );