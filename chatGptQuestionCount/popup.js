function showCount(callback) {
  chrome.storage.local.get(["gptCount"], function (result) {
    callback(result.gptCount);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const result = document.getElementById("result");
  const content = document.getElementById("content");
  const button = document.getElementById("button");
  const usernameField = document.getElementById("username");
  const docs = document.getElementById("docs");
  const donate = document.getElementById("donate");
  const returnBtn = document.getElementById("returnBtn");
  const pixDonation = document.getElementById("pixDonation");
  const paypalDonation = document.getElementById("paypalDonation");
  const defaultContent = document.getElementById("defaultContent");
  const donateContainer = document.getElementById("donateContainer");

  donate.addEventListener("click", (event) => {
    event.preventDefault();
    defaultContent.style.display = "none";
    donateContainer.style.display = "flex";
  });

  returnBtn.addEventListener("click", (event) => {
    event.preventDefault();
    defaultContent.style.display = "flex";
    donateContainer.style.display = "none";
  });

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "https://chat.openai.com";
    window.open(url, "_blank");
  });

  docs.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "https://github.com/euMts/chatgpt_question_count";
    window.open(url, "_blank");
  });

  pixDonation.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "https://nubank.com.br/pagar/1cppij/yQT2VfJJLq";
    window.open(url, "_blank");
  });

  paypalDonation.addEventListener("click", (event) => {
    event.preventDefault();
    const url =
      "https://www.paypal.com/donate/?business=9JLBAMGH5985E&no_recurring=0&item_name=Thank+you%21&currency_code=USD";
    window.open(url, "_blank");
  });

  function updateAndDisplayCount(value) {
    if (value) {
      result.textContent = value;
    } else {
      result.textContent = 0;
    }
  }

  showCount(updateAndDisplayCount);

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.countValue !== undefined) {
      updateAndDisplayCount(request.countValue);
    }
  });

  function displayName(username) {
    usernameField.textContent = username;
  }

  const getUsername = () => {
    const userName = document.evaluate(
      "//div[@class='font-semibold']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue.textContent;
    return userName;
  };

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = tabs[0].url;
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getUsername,
      },
      (resultArray) => {
        try {
          const result = resultArray[0].result;
          console.log(currentUrl);
          console.log(currentUrl.includes("chat.openai.com"));
          if (currentUrl.includes("chat.openai.com")) {
            content.style.display = "flex";
            button.style.display = "none";
          }
          displayName(result);
        } catch {
          console.log("Error getting user's name");
        }
      }
    );
  });
});
