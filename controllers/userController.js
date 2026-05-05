const Expense = require('../models/expense');
const Category = require('../models/category');

// R (Read) - Get all expenses mapped with their category name and fetch stats
exports.getHomePage = (req, res, next) => {
    let fetchedExpenses;
    let fetchedStats;

    Expense.fetchAll()
        .then(([expenses]) => {
            fetchedExpenses = expenses;
            return Expense.getCategoryStats();
        })
        .then(([stats]) => {
            fetchedStats = stats;
            // Compute total
            const total = stats.reduce((sum, s) => sum + Number(s.value), 0);
            res.render('home', {
                expenses: fetchedExpenses,
                statsData: JSON.stringify(stats),
                categoryBreakdown: fetchedStats,
                totalAmount: total
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Database error while fetching expenses or stats.");
        });
};

// C (Create) - Load form
exports.getAddExpense = (req, res, next) => {
    Category.fetchAll()
        .then(([categories]) => {
            res.render('add-expense', { categories: categories });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Database error fetching categories.");
        });
};

// C (Create) - Save to database
exports.postAddExpense = (req, res, next) => {
    const { title, amount, category_id, expense_date } = req.body;
    const newExpense = new Expense(title, amount, category_id, expense_date);

    newExpense.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Database error inserting expense.");
        });
};

// U (Update) - Load form
exports.getEditExpense = (req, res, next) => {
    const expenseId = req.params.id;

    Expense.findById(expenseId)
        .then(([expenseData]) => {
            if (expenseData.length === 0) {
                return res.redirect('/');
            }

            return Category.fetchAll()
                .then(([categories]) => {
                    res.render('edit-expense', {
                        expense: expenseData[0],
                        categories: categories
                    });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Database error fetching expense details.");
        });
};

// U (Update) - Save to database
exports.postEditExpense = (req, res, next) => {
    const expenseId = req.params.id;
    const { title, amount, category_id, expense_date } = req.body;

    Expense.updateById(expenseId, title, amount, category_id, expense_date)
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Database error updating expense.");
        });
};

// D (Delete) - Remove from database
exports.getDeleteExpense = (req, res, next) => {
    const expenseId = req.params.id;

    Expense.deleteById(expenseId)
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Database error deleting expense.");
        });
};