const express = require('express');
const db = require('../utils/db');
const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db('products').where({ id }).first();
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/alternatives', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Mocking finding top 3 alternatives based on ranking
    const alternatives = await db('products')
      .whereNot({ id }) // find other products
      .orderBy('truth_score', 'desc')
      .limit(3);
      
    res.json({
      success: true,
      data: { alternatives: alternatives.map(p => ({ product: p, truthScore: p.truth_score })) }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
