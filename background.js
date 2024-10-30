// for blocking the URLs.

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.get(["blocked", "enabled"], function (local) {
      if (!Array.isArray(local.blocked)) {
        chrome.storage.local.set({ blocked: [] });
      }

      if (typeof local.enabled !== "boolean") {
        chrome.storage.local.set({ enabled: false });
      }
    });
  });

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    const url = changeInfo.pendingUrl || changeInfo.url;
    if (!url || !url.startsWith("http")) {
      return;
    }

    const hostname = new URL(url).hostname;

    chrome.storage.local.get(["blocked", "enabled"], function (local) {
      const { blocked, enabled } = local;
      if (Array.isArray(blocked) && enabled && blocked.find(domain => hostname.includes(domain))) {
        chrome.tabs.remove(tabId);
      }
    });
  });


// ALARM
var sec_left = 0;
var end_time;
var is_running;
var timer;


localStorage.setItem("is_running", 0);


chrome.runtime.onMessage.addListener(
    function(request, sender) {
        if (!is_running && !request.isReset) {
            sec_left = request.seconds;
            end_time = new Date(request.ends);
            is_running = true;
            localStorage.setItem("is_running", 1);
            localStorage.setItem("end_time", end_time);
            if (sec_left < 60) {
                chrome.browserAction.setBadgeText({
                    text: sec_left.toString()
                });
            } else {
                var btext = Math.ceil(sec_left / 60);
                chrome.browserAction.setBadgeText({
                    text: btext.toString()
                });
            }
            count_down();
        } else if (is_running && request.isReset) {
            is_running = false;
            sec_left = 0;
            localStorage.setItem("is_running", 0);
            clearTimeout(timer);
            chrome.browserAction.setBadgeText({
                text: ''
            });
        } else if (is_running && !request.isReset) {}
    }
);




function count_down() {
    sec_left--;
    timer = setTimeout(count_down, 1000);
    if (sec_left < 60) {
        chrome.browserAction.setBadgeText({
            text: sec_left.toString()
        });
    } else if (sec_left % 60 == 0) {
        var btext = Math.ceil(sec_left / 60);
        chrome.browserAction.setBadgeText({
            text: btext.toString()
        });
    }

    if (sec_left == 0) {
        chrome.browserAction.setBadgeText({
            text: ''
        });
        clearTimeout(timer);
        is_running = false;
        sec_left = 0;
        localStorage.setItem("is_running", 0);
        play_music();
    }
}


function play_music() {
    var music_window = PopupCenter("", "", 150, 120);
    music_window.document.write("<audio controls autoplay><source src='alarm.mp3' type='audio/mpeg'></audio>");
}


function PopupCenter(url, title, w, h) {

    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }

    return newWindow;
}




//   TIMER
started = 0;
chrome.browserAction.setBadgeBackgroundColor({
    color: [100, 100, 100, 255]
});
chrome.browserAction.setBadgeText({
    text: 'Off'
});
audio = new Audio("alarm1.mp3");
function setalarm(t) {
    started = 1;
    chrome.browserAction.setBadgeBackgroundColor({
        color: [0, 255, 0, 255]
    });
    chrome.browserAction.setBadgeText({
        text: 'On'
    });
    timeout = setTimeout(function() {
        chrome.storage.local.set({
            'starttime': 0,
            'timelimit': 0
        });
        chrome.storage.local.get({
            'sound': 1
        }, function(result) {
            if (result.sound == 1) audio.play();
        });
        started = 0;
        nID = new Date();
        nID = nID.getTime();
        nID = nID / 1000 | 0;
        nID = nID.toString();
        chrome.notifications.create(nID, {
            type: 'basic',
            title: 'Time is up!',
            message: '',
            priority: 2,
            iconUrl: "img1.jpg"
        }, function() {});
        at = 6;
        c = true;
        interval = setInterval(function() {
            if (c) chrome.browserAction.setBadgeBackgroundColor({
                color: [255, 0, 0, 255]
            });
            else chrome.browserAction.setBadgeBackgroundColor({
                color: [100, 100, 100, 255]
            });
            c = !c;
            at--;
            if (at == 0) clearInterval(interval);
        }, 500);
        chrome.browserAction.setBadgeBackgroundColor({
            color: [100, 100, 100, 255]
        });
        chrome.browserAction.setBadgeText({
            text: 'Off'
        });
    }, t);
}
function clearalarm() {
    clearTimeout(timeout);
    started = 0;
    chrome.browserAction.setBadgeBackgroundColor({
        color: [100, 100, 100, 255]
    });
    chrome.browserAction.setBadgeText({
        text: 'Off'
    });
}
