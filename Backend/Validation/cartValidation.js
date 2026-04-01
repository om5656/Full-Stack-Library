const Joi = require("joi");

const addToCartSchema = Joi.object({
  bookId: Joi.string().required()
});

module.exports = { addToCartSchema };