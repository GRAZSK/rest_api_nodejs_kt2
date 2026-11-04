const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { validateProduct } = require('../middleware/validate');

// Хранилище товаров (в памяти)
const products = [];

// GET /api/products - Получить все товары
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// GET /api/products/:id - Получить товар по ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Товар не найден'
    });
  }

  res.json({
    success: true,
    data: product
  });
});

// POST /api/products - Создать товар
router.post('/', upload.single('image'), validateProduct, (req, res) => {
  const newProduct = {
    id: uuidv4(),
    ...req.body,
    image: req.file ? `/uploads/products/${req.file.filename}` : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Товар успешно создан',
    data: newProduct
  });
});

// PUT /api/products/:id - Обновить товар
router.put('/:id', upload.single('image'), validateProduct, (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Товар не найден'
    });
  }

  const product = products[productIndex];

  // Удаляем старое изображение, если загружено новое
  if (req.file && product.image) {
    const oldImagePath = path.join(__dirname, '../../', product.image);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  products[productIndex] = {
    ...product,
    ...req.body,
    image: req.file ? `/uploads/products/${req.file.filename}` : product.image,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Товар успешно обновлен',
    data: products[productIndex]
  });
});

// DELETE /api/products/:id - Удалить товар
router.delete('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Товар не найден'
    });
  }

  const product = products[productIndex];

  // Удаляем изображение товара
  if (product.image) {
    const imagePath = path.join(__dirname, '../../', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  products.splice(productIndex, 1);

  res.json({
    success: true,
    message: 'Товар успешно удален'
  });
});

module.exports = router;