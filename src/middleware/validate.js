const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Название товара обязательно',
    'string.min': 'Название должно содержать минимум 2 символа',
    'string.max': 'Название не должно превышать 100 символов'
  }),
  description: Joi.string().max(1000).allow('').messages({
    'string.max': 'Описание не должно превышать 1000 символов'
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Цена должна быть числом',
    'number.positive': 'Цена должна быть положительным числом',
    'any.required': 'Цена обязательна'
  }),
  category: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Категория обязательна',
    'any.required': 'Категория обязательна'
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Количество должно быть числом',
    'number.integer': 'Количество должно быть целым числом',
    'number.min': 'Количество не может быть отрицательным',
    'any.required': 'Количество обязательно'
  })
});

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors
      });
    }
    
    next();
  };
}

module.exports = {
  validateProduct: validate(productSchema)
};