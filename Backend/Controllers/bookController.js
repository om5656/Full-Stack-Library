const Book = require("../Models/Book");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: "Book Not Found" });
    }

    res.status(200).json({ book });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = { getBooks, getBookById };
