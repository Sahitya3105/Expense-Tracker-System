const express = require('express');
const userRouter = express.Router();

const userController = require('../controllers/userController')

userRouter.get("/", userController.getHomePage);

userRouter.get("/add-expense", userController.getAddExpense);
userRouter.post("/add-expense", userController.postAddExpense);

userRouter.get("/edit/:id", userController.getEditExpense);
userRouter.post("/edit/:id", userController.postEditExpense);

userRouter.get("/delete/:id", userController.getDeleteExpense);

module.exports = userRouter;    