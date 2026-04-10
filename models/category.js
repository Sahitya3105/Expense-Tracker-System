const db = require('../utils/databaseUtil');

module.exports = class Category {
    static fetchAll() {
        return db.execute('SELECT * FROM categories');
    }
};
