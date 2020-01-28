// var app = chrome.runtime.getBackgroundPage();

const versionSelector = document.getElementById('versionSelector');

chrome.storage.local.get(['desiredVersion'], function(result) {
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

request = new XMLHttpRequest();
request.open('GET', 'https://developer.royalcanin.com/assets/rcdl-releases.json', true);
request.onload = function() {
  if (request.status >= 200 && request.status < 400){
    var data = JSON.parse(request.responseText).releases;
    for (var i = 0; i < data.length; i++) {
      var option = document.createElement("option");
      option.value = data[i];
      option.text = data[i];
      versionSelector.appendChild(option);
    }
  } else {
    console.log('The data was unobtainable.');
  }
};
request.onerror = function() {
  console.log('There was a connection error of some sort.');
};

const dataSet = request.send();

document.getElementById('clickme').addEventListener('click', changeVersion);