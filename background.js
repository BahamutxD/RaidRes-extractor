chrome.action.onClicked.addListener((tab) => {
  // Execute the content script to extract data
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  }, () => {
    // After the content script is injected, call the extractData function
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractDataAndCopy
    });
  });
});

// This function will be executed in the context of the web page
function extractDataAndCopy() {
  extractData(); // Call the existing extractData function from content.js
}