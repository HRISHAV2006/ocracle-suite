const db = require('../utils/db');

// In a real scenario, this would query the Open Food Facts API
// For MVP, we'll mock the response based on the barcode.
async function fetchProductByBarcode(barcode) {
  // If barcode is for "Dove Body Wash" (from spec)
  if (barcode === '8901058860847') {
    return {
      name: 'Dove Body Wash',
      brand: 'Dove',
      ingredients: ['Aqua', 'Sodium Laureth Sulfate', 'Cocamidopropyl Betaine', 'Parfum'],
      category: 'personal_care',
      imageUrl: 'https://example.com/dove.jpg',
      barcode: barcode
    };
  }

  // Generic Mock
  return {
    name: 'Generic Eco Product',
    brand: 'EcoBrand',
    ingredients: ['Water', 'Aloe Vera', 'Natural Fragrance'],
    category: 'personal_care',
    imageUrl: 'https://example.com/generic.jpg',
    barcode: barcode
  };
}

module.exports = { fetchProductByBarcode };
