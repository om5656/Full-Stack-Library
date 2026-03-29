const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/books", userController.getAllBooks);
router.get("/books/:id", userController.getBookById);

router.post("/cart", authMiddleware, userController.addToCart);
router.get("/cart", authMiddleware, userController.getCart);
router.delete("/cart/:bookId", authMiddleware, userController.removeFromCart);

router.post("/borrow/:bookId", authMiddleware, userController.borrowBook);
router.put("/borrow/:borrowId/return", authMiddleware, userController.returnBook);
router.get("/borrows", authMiddleware, userController.getMyBorrows);

module.exports = router;