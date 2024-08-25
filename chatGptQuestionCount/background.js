function saveCount(callback) {
  chrome.storage.local.get(["gptCount"], function (result) {
    var lastValue = result.gptCount || 0;
    var newValue = lastValue + 1;

    chrome.storage.local.set({ gptCount: newValue }, function () {});
    callback(newValue);
  });
}

chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (
      details.url == "https://chatgpt.com/backend-api/conversation" &&
      details.statusCode === 200
    ) {
      saveCount((value) => chrome.runtime.sendMessage({ countValue: value }));
    }
  },
  { urls: ["https://chatgpt.com/*"] },
  ["responseHeaders"]
);
