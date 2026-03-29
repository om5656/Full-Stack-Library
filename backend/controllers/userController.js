const User = require("../models/User");
const Book = require("../models/Book");
const Cart = require("../models/Cart");
const Borrow = require("../models/Borrow");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../validation/userValidation");
const { addToCartSchema } = require("../validation/cartValidation");

const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    const user = await User.create({
      ...value,
      password: hashedPassword
    });

    res.status(201).json({
      msg: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (user.isBanned) {
      return res.status(403).json({ msg: "Account is banned" });
    }

    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SK,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { error, value } = addToCartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    let cart = await Cart.findOne({ user: req.user });
    if (!cart) {
      cart = await Cart.create({
        user: req.user,
        books: [],
        totalPrice: 0
      });
    }

    const book = await Book.findById(value.bookId);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    if (cart.books.includes(book._id)) {
      return res.status(400).json({ msg: "Book already in cart" });
    }

    cart.books.push(book._id);
    cart.totalPrice += book.price;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("books");
    res.json({ msg: "Book added to cart", cart: updatedCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user }).populate("books");
    if (!cart) {
      return res.json({ books: [], totalPrice: 0 });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user }).populate("books");
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const bookIndex = cart.books.findIndex(
      (b) => b._id.toString() === req.params.bookId
    );

    if (bookIndex === -1) {
      return res.status(404).json({ msg: "Book not in cart" });
    }

    const book = cart.books[bookIndex];
    cart.books.splice(bookIndex, 1);
    cart.totalPrice -= book.price;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("books");
    res.json({ msg: "Book removed from cart", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    if (!book.available) {
      return res.status(400).json({ msg: "Book is not available" });
    }

    const existingBorrow = await Borrow.findOne({
      user: req.user,
      book: req.params.bookId,
      status: "borrowed"
    });

    if (existingBorrow) {
      return res.status(400).json({ msg: "You already borrowed this book" });
    }

    const borrow = await Borrow.create({
      user: req.user,
      book: req.params.bookId
    });

    book.available = false;
    await book.save();

    res.status(201).json({ msg: "Book borrowed successfully", borrow });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findOne({
      _id: req.params.borrowId,
      user: req.user,
      status: "borrowed"
    });

    if (!borrow) {
      return res.status(404).json({ msg: "Borrow record not found" });
    }

    borrow.returnDate = new Date();
    borrow.status = "returned";
    await borrow.save();

    const book = await Book.findById(borrow.book);
    book.available = true;
    await book.save();

    res.json({ msg: "Book returned successfully", borrow });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user })
      .populate("book")
      .sort({ borrowDate: -1 });
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getAllBooks,
  getBookById,
  addToCart,
  getCart,
  removeFromCart,
  borrowBook,
  returnBook,
  getMyBorrows
};