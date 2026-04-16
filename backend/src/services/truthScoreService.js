const { fetchProductByBarcode } = require('./offService');
const db = require('../utils/db');

async function calculateTruthScore(productData) {
  // Mock Claude Analysis Pipeline (if process.env.USE_MOCKS === 'true')
  const isToxic = productData.ingredients.join(' ').toLowerCase().includes('sulfate');
  
  let carbonScore, waterScore, toxicityScore, explanations, label;

  if (isToxic) {
    carbonScore = 4.2;
    waterScore = 3.1;
    toxicityScore = 4.0;
    label = 'Ghost Label';
    explanations = [
      'Contains Sodium Laureth Sulfate (SLS) which has high aquatic toxicity.',
      'Synthetic fragrances often derived from petrochemicals.'
    ];
  } else {
    carbonScore = 8.5;
    waterScore = 8.0;
    toxicityScore = 9.0;
    label = 'Genuinely Sustainable';
    explanations = [
      'Contains highly biodegradable natural ingredients.',
      'No common irritants or petrochemical derivatives detected.'
    ];
  }

  const overallScore = (carbonScore * 0.40) + (waterScore * 0.35) + (toxicityScore * 0.25);

  return {
    overall: Math.round(overallScore * 10) / 10,
    carbon: carbonScore,
    water: waterScore,
    toxicity: toxicityScore,
    label: label,
    explanation: explanations,
    dataSource: 'Mocked OFF + Claude Analysis',
    generatedAt: new Date().toISOString()
  };
}

async function scanProduct(barcode) {
  // 1. Fetch from source
  const productInfo = await fetchProductByBarcode(barcode);
  
  // 2. Calculate score
  const truthScore = await calculateTruthScore(productInfo);

  // 3. Upsert product into db asynchronously for history
  const dbProduct = await db('products').where({ barcode }).first();
  let productId;
  if (!dbProduct) {
    const [insertedIds] = await db('products').insert({
      barcode,
      name: productInfo.name,
      brand: productInfo.brand,
      category: productInfo.category,
      image_url: productInfo.imageUrl,
      ingredients: JSON.stringify(productInfo.ingredients),
      truth_score: truthScore.overall,
      carbon_score: truthScore.carbon,
      water_score: truthScore.water,
      toxicity_score: truthScore.toxicity
    }).returning('id');
    productId = insertedIds ? insertedIds.id : null;
  } else {
    productId = dbProduct.id;
  }

  return {
    success: true,
    data: {
      product: { ...productInfo, id: productId },
      truthScore: truthScore,
      cached: false
    }
  };
}

module.exports = { scanProduct, calculateTruthScore };
