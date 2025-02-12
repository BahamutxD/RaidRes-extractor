document.getElementById('extract').addEventListener('click', () => {
  executeScriptWithType(true);
});

document.getElementById('extractplus').addEventListener('click', () => {
  executeScriptWithType(false);
});

function executeScriptWithType(typeSR) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js'] 
    }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: callExtractDataWithType,
        args: [typeSR] 
      });
    });
  });
}


function callExtractDataWithType(typeSR) {
  extractData(typeSR);
}
