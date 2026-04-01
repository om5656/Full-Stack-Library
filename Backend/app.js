require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

const bookRoutes = require("./Routes/bookRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const userRoutes = require("./Routes/userRoutes");

app.use("/api/books", bookRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

mongoose.connect(process.env.DB_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
