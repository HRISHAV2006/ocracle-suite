const express = require('express');
const { scanProduct } = require('../services/truthScoreService');
const router = express.Router();

router.post('/barcode', async (req, res, next) => {
  try {
    const { barcode } = req.body;
    if (!barcode) {
      return res.status(400).json({ error: 'Barcode is required' });
    }

    const result = await scanProduct(barcode);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/text', async (req, res, next) => {
  try {
    const { text, category } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    // Mock generic text scan
    const result = await scanProduct('mock-text-scan'); 
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
