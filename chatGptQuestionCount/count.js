document.addEventListener("DOMContentLoaded", function () {
  const result = document.getElementById("result");
  const content = document.getElementById("content");
  const button = document.getElementById("button");
  const username = document.getElementById("username");
  const donate = document.getElementById("donate");
  const docs = document.getElementById("docs");
  const returnBtn = document.getElementById("returnBtn");
  const pixDonation = document.getElementById("pixDonation");
  const mercadoPagoDonation = document.getElementById("mercadoPagoDonation");

  donate.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("default").style.display = "none";
    document.getElementById("donateContainer").style.display = "flex";
  });

  returnBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("default").style.display = "flex";
    document.getElementById("donateContainer").style.display = "none";
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "https://chat.openai.com";
    window.open(url, "_blank");
  });

  docs.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "https://github.com/euMts";
    window.open(url, "_blank");
  });

  pixDonation.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "https://nubank.com.br/pagar/1cppij/yQT2VfJJLq";
    window.open(url, "_blank");
  });

  mercadoPagoDonation.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "https://link.mercadopago.com.br/matheusetp";
    window.open(url, "_blank");
  });

  function getUsername() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTabId = tabs[0].id;

      chrome.tabs.executeScript(activeTabId, { file: "count.js" }, function () {
        chrome.tabs.sendMessage(
          activeTabId,
          { action: "getUsername" },
          function (response) {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              return;
            }

            if (response && response.chatUsername !== undefined) {
              username.textContent = response.chatUsername || "N/A";
              console.log(response.currentUrl);
              if (response.currentUrl === "chat.openai.com") {
                content.style.display = "flex";
                button.style.display = "none";
              }
            } else {
              console.error("Response is undefined or missing 'getUsername'.");
            }
          }
        );
      });
    });
  }

  getUsername();

  chrome.webRequest.onCompleted.addListener(
    function (details) {
      if (
        details.url === "https://chat.openai.com/backend-api/conversation" &&
        details.statusCode === 200
      ) {
        saveData(function () {
          showData(function (currentCount) {
            result.textContent = `${currentCount}`;
          });
        });
      }
    },
    { urls: ["https://chat.openai.com/backend-api/*"] },
    ["responseHeaders"]
  );

  showData(function (currentCount) {
    result.textContent = `${currentCount}`;
  });
});

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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getUsername") {
    var specificElement = document.evaluate(
      '//div[@class="font-semibold"]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    var chatUsername = specificElement ? specificElement.innerHTML : "null";

    sendResponse({
      chatUsername: chatUsername,
      currentUrl: document.location.host,
    });
  }
});
