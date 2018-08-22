
var sqlite3 = require('sqlite3').verbose();

function loadProducts() {
    "use strict";
    var productList = [];

    var db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READONLY);
    db.all('SELECT * FROM products', [], databaseProductsCallback);
    function databaseProductsCallback(err, rows) {
        if (err) {
            console.log(err);
        } else {
            for (var i = 0; i < rows.length; i++) {
                var product = rows[i];
                console.log('Loaded product from db: ' + product.name);
                productList.push(product);
            }
        }
    }

    db.close();
    return productList;
}


module.exports = {
    function: loadProducts,
    list: loadProducts()
};
