function checkGray(item, cb) {
    if (item) {
        if (typeof cb === 'function') {
            cb();
        }
    }
}

chrome.runtime.onMessage.addListener((msg, send, resp) => {
    let gray = document.getElementById(`overlay_${chrome.runtime.id}`);

    checkGray(gray, () => {
        if (msg.action === "hide_overlay") {
            gray.style.display = "none";
        } else if (msg.action === "show_overlay") {
            gray.style.display = "block";
            chrome.extension.connect(chrome.runtime.id)
                .onDisconnect.addListener(() => {
                    gray.style.display = "none"
                });
        }
    })
});

function getGray() {
    return `<div id='overlay_${chrome.runtime.id}' onclick="this.style.display='none'" style="
  z-index: 9999999;
  cursor: pointer;
  position: fixed;
  background-color: rgba(0,0,0,0.5);
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: none;"></div>`
}

document.body.insertAdjacentHTML("beforeend", getGray());
