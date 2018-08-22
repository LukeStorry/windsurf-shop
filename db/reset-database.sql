DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT,
    surname TEXT,
    email TEXT,
    password TEXT --hashed
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  price FLOAT NOT NULL,
  type VARCHAR(10) NOT NULL,
  description VARCHAR(50) NOT NULL,
  imgPath VARCHAR(50) NOT NULL
);
