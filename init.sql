USE serverdb;
CREATE TABLE IF NOT EXISTS credentials ( name VARCHAR(20) NOT NULL UNIQUE, username VARCHAR(20) NOT NULL UNIQUE, password VARCHAR(20) NOT NULL, PRIMARY KEY(username));
CREATE TABLE IF NOT EXISTS files (filename VARCHAR(255) NOT NULL, size VARCHAR(20) NOT NULL, time TIME NOT NULL, date DATE NOT NULL, username VARCHAR(20) NOT NULL);

