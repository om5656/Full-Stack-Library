const express = require("express");
const router = express.Router();

const { addBook, updateBook, deleteBook } = require("../Controllers/adminController");
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");

const upload = require("../utils/multerConfig");

router.post(
  "/book",
  authMiddleware,
  adminMiddleware,
  upload.single("pdf"),
  addBook
);

router.put(
  "/book/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("pdf"),
  updateBook
);

router.delete(
  "/book/:id",
  authMiddleware,
  adminMiddleware,
  deleteBook
);

module.exports = router;
