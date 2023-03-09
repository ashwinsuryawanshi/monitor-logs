
// listen to messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  const logsTableBody = document.getElementById('logsTableBody');
  const logRow = document.createElement('tr');
  const messageTypeCell = document.createElement('td');
  const detailsCell = document.createElement('td');
  
  messageTypeCell.textContent = message.type;
  detailsCell.textContent = message.message;
  
  logRow.appendChild(messageTypeCell);
  logRow.appendChild(detailsCell);
  logsTableBody.appendChild(logRow);
});
