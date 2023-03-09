'use strict';

function setLogs(event) {
  chrome.tabs.create({'url': "/logs.html" })
}

document.getElementById('logs').addEventListener('click', setLogs);