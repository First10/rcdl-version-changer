// var app = chrome.runtime.getBackgroundPage();

const versionSelector = document.getElementById('versionSelector');

chrome.storage.local.get(['desiredVersion'], function(result) {
  console.log('Value currently is ' + result.desiredVersion);
  document.querySelectorAll(`option[value="${result.desiredVersion}"]`)[0].setAttribute('selected', true);
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {data: text}, function(response) {
    console.log('response:', response);
  });
});

function changeVersion(e) {
  chrome.storage.local.set({desiredVersion: versionSelector.value}, function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
    return
  });
}

document.getElementById('clickme').addEventListener('click', changeVersion);