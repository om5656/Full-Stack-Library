const Book = require("../models/Book");
const bookValidation = require("../validation/bookValidation");
const fs = require("fs").promises;
const path = require("path");

const addBook = async (req, res) => {
  try {
    const { error, value } = bookValidation.validate(req.body);
    if (error) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ msg: error.details[0].message });
    }

    if (req.file) {
      value.pdfUrl = `/uploads/${req.file.filename}`;
    }

    const book = await Book.create(value);
    res.status(201).json({ msg: "Book added successfully", book });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path);
    res.status(500).json({ msg: "Server error" });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(404).json({ msg: "Book not found" });
    }

    const { error, value } = bookValidation.validate(req.body);
    if (error) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ msg: error.details[0].message });
    }

    if (req.file) {

        if (book.pdfUrl) {
        const oldPath = path.join(__dirname, "..", book.pdfUrl);
        try {
          await fs.unlink(oldPath);
        } catch (err) {
          console.log("Old file not found");
        }
      }
      value.pdfUrl = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, value, {
      new: true
    });

    res.json({ msg: "Book updated successfully", book: updatedBook });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path);
    res.status(500).json({ msg: "Server error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    if (book.pdfUrl) {
      const filePath = path.join(__dirname, "..", book.pdfUrl);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.log("File not found");
      }
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ msg: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { addBook, updateBook, deleteBook };