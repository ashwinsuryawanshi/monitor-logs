
// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(message) {
    if (message.type === 'log') {
      // Save the log message to storage
      chrome.storage.local.get({logs: []}, function(data) {
        let logs = data.logs;
        logs.push(message.log);
        chrome.storage.local.set({logs: logs}, function() {
          console.log('Log message saved:', message.log);
        });
      });
    }
  });
  
  // Open the logs page when the extension button is clicked
  chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.create({url: 'logs.html'});
  });
  

