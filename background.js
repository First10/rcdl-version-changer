(function() {

  "use strict";

  var desiredVersion = null;

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