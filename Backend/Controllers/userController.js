const User = require("../Models/User");
const Book = require("../Models/Book");
const Cart = require("../Models/Cart");
const Borrow = require("../Models/Borrow");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../Validation/userValidation");
const { addToCartSchema } = require("../Validation/cartValidation");

const register = async (req,res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if(error) return res.status(400).json({ msg: error.details.map(e=>e.message) });

    const exist = await User.findOne({ email: value.email });
    if(exist) return res.status(400).json({ msg:"User Exists" });

    value.password = await bcrypt.hash(value.password,10);
    const user = await User.create(value);

    res.status(201).json({ msg: "User Registered", user });
  } catch(err) {
    res.status(500).json({ msg: "Server Error" });
  }
}

const login = async (req,res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if(error) return res.status(400).json({ msg: error.details.map(e=>e.message) });

    const user = await User.findOne({ email: value.email });
    if(!user) return res.status(400).json({ msg:"User Not Found" });

    const match = await bcrypt.compare(value.password, user.password);
    if(!match) return res.status(400).json({ msg:"Invalid Password" });

    const token = jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SK, { expiresIn: "1d" });
    res.status(200).json({ msg:"Login Success", token });
  } catch(err) {
    res.status(500).json({ msg: "Server Error" });
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
}

const addToCart = async (req,res) => {
  try {
    const { error, value } = addToCartSchema.validate(req.body);
    if(error) return res.status(400).json({ msg: error.details.map(e=>e.message) });

    let cart = await Cart.findOne({ user: req.user });
    if(!cart) cart = await Cart.create({ user: req.user, books: [], totalPrice: 0 });

    const book = await Book.findById(value.bookId);
    if(!book) return res.status(404).json({ msg:"Book Not Found" });

    cart.books.push(book._id);
    cart.totalPrice += book.price;
    await cart.save();

    res.status(200).json({ msg:"Book Added to Cart", cart });
  } catch(err) {
    res.status(500).json({ msg: "Server Error" });
  }
}


const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ msg: "Book Not Found" });

    const borrow = await Borrow.create({
      user: req.user,
      book: bookId
    });

    res.status(201).json({ msg: "Book Borrowed", borrow });

  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};


const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user }).populate("book");
    res.status(200).json({ borrows });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};


const returnBook = async (req, res) => {
  try {
    const { id } = req.params;

    const borrow = await Borrow.findById(id);
    if (!borrow) return res.status(404).json({ msg: "Borrow Not Found" });

    borrow.status = "returned";
    borrow.returnDate = new Date();

    await borrow.save();

    res.status(200).json({ msg: "Book Returned", borrow });

  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};


module.exports = { register, login, getProfile, addToCart , borrowBook , getMyBorrows , returnBook };
