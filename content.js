function extractData() {
  const rows = document.querySelectorAll('tbody.m_b2404537 tr.m_4e7aa4fd');
  const softreserves = [];

  // Extract the instance name from the <title> tag
  const title = document.querySelector('title')?.innerText || '';
  const instanceName = title.replace(/^Raidres - /, '').trim(); // Remove "Raidres - " prefix

  // Extract the Raid ID from the hidden input field
  const raidId = document.querySelector('input[name="raidEventReference"]')?.value || null;

  rows.forEach(row => {
    const playerName = row.querySelector('p.m_b6d8b162')?.innerText.trim() || '';
    const itemElement = row.querySelector('a.m_b6d8b162');
    const itemLink = itemElement?.href || '';
    const itemName = itemElement?.innerText.trim() || '';
    let playerComment = row.querySelector('td.comment-cell')?.innerText.trim() || '';

    // Process SR+ values in the player comment
    playerComment = playerComment.replace(/SR\+(\d+)/g, (match, p1) => {
      const value = parseInt(p1, 10) * 1; // Multiply SR+ value by 100
      return `${value}`;
    });

    // Extract the item ID from the item link
    const itemId = itemLink ? new URL(itemLink).searchParams.get('item') : null;

    // Extract item color from the inline style
    const itemColorStyle = itemElement?.getAttribute('style') || '';
    let quality = null;
    if (itemColorStyle.includes('rgb(255, 128, 0)')) quality = 5; // Legendary
    else if (itemColorStyle.includes('rgb(168, 63, 238)')) quality = 4; // Epic
    else if (itemColorStyle.includes('rgb(0, 127, 255)')) quality = 3; // Rare

    // Find existing player entry or create a new one
    let playerEntry = softreserves.find(p => p.name === playerName);
    if (!playerEntry) {
      playerEntry = { name: playerName, items: [] };
      softreserves.push(playerEntry);
    }

    // Add item to the player's list
    playerEntry.items.push({
      id: itemId ? parseInt(itemId, 10) : null, // Ensure it's a number
      quality: quality,
      sr_plus: playerComment || ''
    });
  });

  // Construct the final object
  const extractedData = {
    metadata: {
      id: raidId, // Correct raid ID from the hidden input
      instance: 95, // Needs correct mapping if available
      instances: [instanceName], // Corrected instance name
      origin: 'raidres'
    },
    softreserves: softreserves,
    hardreserves: []
  };

  // Convert data to JSON with no extra indentation
  const extractedText = JSON.stringify(extractedData, null, 0);

  // Convert the extracted data to Base64 encoding
  const base64EncodedData = btoa(extractedText.trim());

  // Copy the data to the clipboard
  copyToClipboard(base64EncodedData);

  // Function to handle clipboard copy with fallback
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      // Try modern clipboard API
      navigator.clipboard.writeText(text).then(() => {
        console.log('Data copied to clipboard');
      }).catch(err => {
        console.error('Error copying:', err);
        fallbackCopyText(text);
      });
    } else {
      // Use fallback method
      fallbackCopyText(text);
    }
  }

  // Fallback using execCommand
  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('Data copied to clipboard');
    } catch (err) {
      console.error('Error copying:', err);
    }
    document.body.removeChild(textArea);
  }
}
