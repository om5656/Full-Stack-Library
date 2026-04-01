const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
    
    },

  books: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
    }],
  
  totalPrice: { 
    type: Number,
    default: 0
    
    }

}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);