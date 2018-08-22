--- sqlite3 script for loading products from the CSV file, from a npm prompt
DELETE FROM products;

.mode csv
.headers on
.import ./db/products.csv products

SELECT name FROM products;
