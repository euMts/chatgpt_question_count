function updateCount(newValue, callback) {
  chrome.storage.local.get(["gptCount"], function () {
    chrome.storage.local.set({ gptCount: parseInt(newValue) }, function () {});
  });
  callback();
}

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
  const inputContent = document.getElementById("inputContent");
  const newCountBtn = document.getElementById("newCountBtn");
  const inputCount = document.getElementById("inputCount");

  function updateAndDisplayCount(value) {
    if (value) {
      result.textContent = value;
    } else {
      result.textContent = 0;
    }
  }

  inputCount.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      newCountBtn.click();
    }
  });

  result.addEventListener("click", (event) => {
    event.preventDefault();
    content.style.display = "none";
    inputContent.style.display = "flex";
    inputCount.value = result.textContent;
  });

  newCountBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (inputCount.value < 0) {
      inputCount.value = 0;
    }
    inputCount.value = Number(String(inputCount.value));
    updateCount(inputCount.value, function () {
      content.style.display = "flex";
      inputContent.style.display = "none";
      updateAndDisplayCount(inputCount.value);
    });
  });

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
    try {
      const userName = document.evaluate(
        "//div[@class='font-semibold']",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue.textContent;
      const firstName = userName.split(" ");

      if (userName === "" || !userName) {
        return "name_here";
      }

      if (firstName) {
        return firstName[0];
      }

      return userName;
    } catch {
      return "name_here";
    }
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
