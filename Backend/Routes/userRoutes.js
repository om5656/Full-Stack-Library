const express = require("express");
const router = express.Router();
const { register, login, getProfile, addToCart , borrowBook , getMyBorrows , returnBook } = require("../Controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getProfile);
router.post("/cart", authMiddleware, addToCart);

router.post("/borrow", authMiddleware, borrowBook);
router.get("/borrows", authMiddleware, getMyBorrows);
router.put("/return/:id", authMiddleware, returnBook);

module.exports = router;
