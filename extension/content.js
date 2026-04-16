chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract_ingredients") {
    // Basic heuristic to find ingredient blocks on eCommerce sites
    const textNodes = document.body.innerText.split('\n');
    let ingredients = null;
    
    for (let i = 0; i < textNodes.length; i++) {
        if (textNodes[i].toLowerCase().includes('ingredient')) {
            ingredients = textNodes.slice(i, i + 5).join(' '); // capture following lines
            break;
        }
    }
    
    sendResponse({ ingredients: ingredients });
  }
  return true;
});
