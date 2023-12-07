chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (
      details.url === "https://chat.openai.com/backend-api/conversation" &&
      details.statusCode === 200
    ) {
      saveData(function () {
        showData(function () {});
      });
    }
  },
  { urls: ["https://chat.openai.com/backend-api/*"] },
  ["responseHeaders"]
);

function saveData(callback) {
  chrome.storage.local.get(["count"], function (result) {
    var lastValue = result.count || 0;
    var newValue = lastValue + 1;

    chrome.storage.local.set({ count: newValue }, function () {
      callback();
    });
  });
}

function showData(callback) {
  chrome.storage.local.get(["count"], function (result) {
    var currentCount = result.count || 0;
    callback(currentCount);
  });
}
