const express = require('express');
const router = express.Router();
const productsRouter = require('./products');

router.use('/api/products', productsRouter);
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API работает',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;