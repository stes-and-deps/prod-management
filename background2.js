var defaultFilters = ["*://*.youtube.com/*"];
function blockRequest(details) {
  return { cancel: true };
}

chrome.storage.local.set({ toggle: false });
chrome.storage.local.set({ filter: [] });
chrome.storage.local.onChanged.addListener(update);

function updateFilter() {
  chrome.storage.local.get(["filter"], function (result) {
    defaultFilters = result.filter;
    // chrome.extension.getBackgroundPage().console.log(defaultFilters);
  });
}

function update() {
  chrome.storage.local.get(["toggle"], function (result) {
    if (!result.toggle) {
      updateFilter();
      chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
      // chrome.extension.getBackgroundPage().console.log("false");
    } else {
      updateFilter();
      chrome.webRequest.onBeforeRequest.addListener(
        blockRequest,
        { urls: defaultFilters },
        ["blocking"]
      );
      // chrome.extension.getBackgroundPage().console.log("true");
    }
  });
}
update();
