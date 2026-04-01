const Joi = require("joi");

const bookSchema = Joi.object(
  {
  title: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().required(),
  pdfUrl: Joi.string().uri() 
}
);

module.exports = bookSchema;