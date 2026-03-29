const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().positive().required(),
  pdfUrl: Joi.string().uri().optional()
});

module.exports = bookSchema;