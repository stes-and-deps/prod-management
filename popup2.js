const toggle = document.getElementById("toggle");
const ok = document.getElementById("ok_btn");
const filterList = document.getElementById("filterList");
const reset = document.getElementById("reset_btn");
const alert = document.getElementById("alert");

document.addEventListener("DOMContentLoaded", documentEvents, false);
const updateText = () => {
  chrome.storage.local.get(["toggle"], function (result) {
    if (result.toggle) {
      toggle.innerHTML = `<i class="far fa-stop-circle"></i>Stop Focus`;
      toggle.classList.add("st-btn-focus");
    } else {
      toggle.innerHTML = `<i class="far fa-clock"></i>Start Focus`;
      toggle.classList.remove("st-btn-focus");
    }
  });
};
const updateList = () => {
  chrome.storage.local.get(["filter"], function (result) {
    if (result.filter.length == 0) {
      filterList.innerHTML = "no filter";
    } else {
      filterList.innerHTML = result.filter
        .map((item) => `${item}<br/>`)
        .join("");
    }
  });
};
updateList();
updateText();

chrome.storage.local.onChanged.addListener(updateText);
chrome.storage.local.onChanged.addListener(updateList);

const myAction = (input) => {
  // chrome.extension.getBackgroundPage().console.log(input.value);

  if (input.value.length == 0) {
    // chrome.storage.local.set({ filter: [] });
    showAlert();
  } else {
    const arr = makearr(input.value);
    chrome.storage.local.get(["filter"], function (result) {
      chrome.storage.local.set({ filter: result.filter.concat(arr) });
    });
    // chrome.storage.local.set({ filter: arr });
    chrome.storage.local.set({ toggle: false });
    filterList.innerHTML = arr.map((item) => `${item}<br/>`).join("");
  }
};

const makearr = (input) => {
  const result = input.split(",");
  // let trim = result.map((str) => str.trim());
  let trim = [];
  for (item of result) {
    if (item.trim().length != 0) {
      trim.push(item.trim());
    }
  }
  return trim.map((item) => {
    if (item.length == 0) {
      return;
    }
    if (item.includes("https://")) {
      item = item.replace("https://", "");
    }
    if (item.includes("http://")) {
      item = item.replace("http://", "");
    }
    if (item.includes("www.")) {
      item = item.replace("www.", "");
    }
    const last = item.charAt(item.length - 1);
    if (last == "/") {
      return `*://*.${item}*`;
    }
    return `*://*.${item}/*`;
  });
};

const showAlert = () => {
  alert.innerHTML = `<i class="fas fa-info-circle"></i>Please add at least one website`;
  setTimeout(() => {
    alert.innerHTML = null;
  }, 5000);
};

function documentEvents() {
  ok.addEventListener("click", function () {
    myAction(document.getElementById("textbox"));
    document.getElementById("textbox").value = "";
  });
  toggle.addEventListener("click", function () {
    chrome.storage.local.get(["filter"], function (r) {
      if (r.filter.length != 0) {
        chrome.storage.local.get(["toggle"], function (result) {
          chrome.storage.local.set({ toggle: !result.toggle });
        });
      } else {
        showAlert();
      }
    });
  });
  reset.addEventListener("click", function () {
    chrome.storage.local.set({ filter: [] });
    chrome.storage.local.set({ toggle: false });
  });
}
