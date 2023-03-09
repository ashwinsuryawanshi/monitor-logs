// Select the node that will be observed for mutations
const targetNode = document.querySelector('body');

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] };

// Keep track of added nodes and modified elements
let addedNodes = new Set();
let modifiedElements = new Set();

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
  // Loop through the list of mutations
  for(const mutation of mutationsList) {
    // Check if a node was added to the DOM
    if (mutation.type === 'childList') {
      // Loop through the added nodes
      for(const node of mutation.addedNodes) {
        // Check if the added node is an iframe and not already logged
        if (node.tagName === 'IFRAME' && !addedNodes.has(node)) {
          // Add the node to the set of added nodes
          addedNodes.add(node);
          // Send a message to the background script with the details of the added iframe
          chrome.runtime.sendMessage({type: 'log', log: `Iframe added to the page with src ${node.src}`});
        }
        // Check if the added node has a higher z-index than the page and not already logged
        else if (!addedNodes.has(node)) {
          // Get the computed style of the added node
          const computedStyle = window.getComputedStyle(node);
          // Get the z-index of the added node
          const zIndex = Number(computedStyle.getPropertyValue('z-index'));
          // Check if the added node has a higher z-index than the page
          if (zIndex > 0) {
            // Add the node to the set of added nodes
            addedNodes.add(node);
            // Send a message to the background script with the details of the added element with higher z-index
            chrome.runtime.sendMessage({type: 'log', log: `Element with higher z-index than the page added to the page with z-index ${zIndex}`});
          }
        }
      }
    }
    // Check if a style attribute was modified
    else if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
      // Get the computed style of the modified element
      const computedStyle = window.getComputedStyle(mutation.target);
      // Get the z-index of the modified element
      const zIndex = Number(computedStyle.getPropertyValue('z-index'));
      // Check if the modified element has a higher z-index than the page and not already logged
      if (zIndex > 0 && !modifiedElements.has(mutation.target)) {
        // Add the element to the set of modified elements
        modifiedElements.add(mutation.target);
        // Send a message to the background script with the details of the modified element with higher z-index
        chrome.runtime.sendMessage({type: 'log', log: `Element with higher z-index than the page modified with z-index ${zIndex}`});
      }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
