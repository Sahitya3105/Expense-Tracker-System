const db = require('../utils/databaseUtil');

module.exports = class Expense {
    constructor(title, amount, category_id, expense_date) {
        this.title = title;
        this.amount = amount;
        this.category_id = category_id;
        this.expense_date = expense_date;
    }

    save() {
        return db.execute(
            'INSERT INTO expenses (title, amount, category_id, expense_date) VALUES (?, ?, ?, ?)',
            [this.title, this.amount, this.category_id, this.expense_date]
        );
    }

    static fetchAll() {
        return db.execute(`
            SELECT e.id, e.title, e.amount, DATE_FORMAT(e.expense_date, '%Y-%m-%d') as expense_date, c.category_name as category 
            FROM expenses e 
            LEFT JOIN categories c ON e.category_id = c.id 
            ORDER BY e.expense_date DESC
        `);
    }

    static findById(id) {
        return db.execute(
            "SELECT id, title, amount, category_id, DATE_FORMAT(expense_date, '%Y-%m-%d') as expense_date FROM expenses WHERE id = ?", 
            [id]
        );
    }

    static updateById(id, updatedTitle, updatedAmount, updatedCategoryId, updatedExpenseDate) {
        return db.execute(
            'UPDATE expenses SET title = ?, amount = ?, category_id = ?, expense_date = ? WHERE id = ?',
            [updatedTitle, updatedAmount, updatedCategoryId, updatedExpenseDate, id]
        );
    }

    static deleteById(id) {
        return db.execute('DELETE FROM expenses WHERE id = ?', [id]);
    }

    static getCategoryStats() {
        return db.execute(`
            SELECT c.category_name as label, SUM(e.amount) as value 
            FROM expenses e 
            JOIN categories c ON e.category_id = c.id 
            GROUP BY c.category_name
        `);
    }
};
