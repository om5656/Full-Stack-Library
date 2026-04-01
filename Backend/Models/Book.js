const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  
  title: { 
  type: String,
  // unique : true,  
  required: true
},
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  pdfUrl: {
    type: String
  },

  available: {
    type: Boolean,
    default: true
  },
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);