(function() {

  console.log('test');

  "use strict";

  var desiredVersion = null;



  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
      var json = xhr.responseText;                         // Response
      json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
      json = JSON.parse(json);                             // Parse JSON
      // ... enjoy your parsed json...
  };
  // Example:
  console.log('json', xhr.open('GET', 'https://data.ct.gov/api/views/rybz-nyjw/rows.json'));
  xhr.send();




  getData('desiredVersion').then((value) => {
    desiredVersion = value;
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let key in changes) {
      if (key !== 'desiredVersion'){
        return
      }
      let storageChange = changes[key];
      desiredVersion = storageChange.newValue;
    }
    console.log('test');
  });

  function getData(key) {
    return new Promise ((resolve, reject) => {
      chrome.storage.local.get([`${key}`], (result) => {
        return resolve(result.desiredVersion);
      });
    });
  }

  function setData(key, value){
    return chrome.storage.local.set({key: value}, function() {});
  }

  chrome.webRequest.onBeforeRequest.addListener(function(details) {
    if (details.tabId > -1) {
      if (!details.initiator ||
        !details.initiator.includes('royalcanin') ||
        !details.url.match(/(prefix|min\.bundle|critical)/)
      ){
        return;
      }

      const url = new URL(details.url);
      const sourceVersion = url.searchParams.get('v');

      if (!desiredVersion || sourceVersion == desiredVersion){
        return;
      }

      setData('sourceVersion', sourceVersion);

      const newURL = details.url.replace(sourceVersion, desiredVersion);
      return {redirectUrl: newURL};
    }
  }, {
    urls: ["<all_urls>"]
  }, ["blocking"]);


})();