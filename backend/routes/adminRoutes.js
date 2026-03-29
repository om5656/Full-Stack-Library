const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const upload = require("../utils/multerHandler");

router.post(
  "/book",
  authMiddleware,
  adminMiddleware,
  upload.single("pdf"),
  adminController.addBook
);

router.put(
  "/book/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("pdf"),
  adminController.updateBook
);

router.delete(
  "/book/:id",
  authMiddleware,
  adminMiddleware,
  adminController.deleteBook
);

module.exports = router;