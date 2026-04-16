document.getElementById('scanBtn').addEventListener('click', async () => {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = 'Scanning page...';
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extract_ingredients" }, async (response) => {
      if (!response || !response.ingredients) {
        resultDiv.innerHTML = '<span style="color:var(--text-muted)">No ingredients found on this page.</span>';
        return;
      }
      
      resultDiv.innerHTML = 'Analyzing with OCRacle AI...';
      
      try {
        const res = await fetch('http://localhost:3001/api/v1/scan/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: response.ingredients, category: 'unknown' })
        });
        const data = await res.json();
        
        if (data.success) {
          resultDiv.innerHTML = `
            <div style="font-size:32px; font-weight:900; color: ${data.data.truthScore.overall < 5 ? '#cc0000' : '#34d399'}">${data.data.truthScore.overall} / 10</div>
            <div style="margin-top: 8px;">${data.data.truthScore.label}</div>
            <div style="font-size:11px; margin-top:8px; text-align:left; color:#aaa;">${data.data.truthScore.explanation[0]}</div>
          `;
        } else {
          resultDiv.innerHTML = 'Error communicating with OCRacle Core.';
        }
      } catch (err) {
        resultDiv.innerHTML = 'Network Error. Ensure OCRacle Server is running.';
      }
    });
  });
});
