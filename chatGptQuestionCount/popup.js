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
  const count = document.getElementById("count");
  const result = document.getElementById("result");
  const content = document.getElementById("content");
  const button = document.getElementById("button");
  const profilePicField = document.getElementById("profilePic");
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

  count.addEventListener("click", (event) => {
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

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "https://chatgpt.com";
    window.open(url, "_blank");
  });

  showCount(updateAndDisplayCount);

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.countValue !== undefined) {
      updateAndDisplayCount(request.countValue);
    }
  });

  function displayImg(profilePicSrc) {
    profilePicField.src = profilePicSrc;
  }

  const getProfilePic = () => {
    try {
      const userImageElement = document.evaluate(
        "//img[@alt='User']",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (userImageElement === "" || !userImageElement) {
        return undefined;
      }

      return userImageElement.getAttribute("src");
    } catch {
      return undefined;
    }
  };

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = tabs[0].url;
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getProfilePic,
      },
      (resultArray) => {
        try {
          const result = resultArray[0].result;
          if (currentUrl.includes("chatgpt.com")) {
            content.style.display = "flex";
            button.style.display = "none";
          }
          displayImg(result);
        } catch {
          console.log("Error getting user's profile pic");
        }
      }
    );
  });
});
