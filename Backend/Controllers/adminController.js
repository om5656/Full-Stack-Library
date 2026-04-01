const Book = require("../Models/Book");
const bookValidation = require("../Validation/bookValidation");

const addBook = async (req, res) => {
  try {
    const { error, value } = bookValidation.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details.map(e => e.message) });


    if (req.file) {
      value.pdfUrl = req.file.path;
    }

    const newBook = await Book.create(value);

    res.status(201).json({
      msg: "Book Added",
      book: newBook
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = bookValidation.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details.map(e => e.message) });

    if (req.file) {
      value.pdfUrl = req.file.path;
    }

    const book = await Book.findByIdAndUpdate(id, value, { new: true });

    res.status(200).json({
      msg: "Book Updated",
      book
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const bookExist = await Book.findById(id);

    if(!bookExist)
      return res.status(404).json({msg: "Book not found"});

    await Book.findByIdAndDelete(id);

    res.status(200).json({
      msg: "Book Deleted"
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


module.exports = {  addBook, updateBook, deleteBook };
