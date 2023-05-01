//Clear the flag on startup
chrome.runtime.onStartup.addListener(function() {
    console.log("clearing the is_running flag at startup");
    chrome.storage.local.set({ "is_running": false }).then(() => {
        console.log("Value is_running is set to " + false);
    });
  })

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    if (message === 'start_stop') {
        chrome.storage.local.get(["is_running"]).then((result) => {
            console.log("Value is_running is: " + result.is_running);
            if (result.is_running) {
                stopLooping();
                sendResponse("Detected running, stopping");
            }
            else {
                startLooping();
                sendResponse("Detected stopped, running");
            }
            
        });
    }
});

let timer;
const startLooping = () => {
    console.log("Going to start looping");
    let currentTab = 0;
    if (timer != null) {
        console.error("Timer is already running, not starting");
        chrome.storage.local.set({ "is_running": false }).then(() => {
            console.log("Value is_running is set to " + false);
        });
        return;
    }
    timer = setInterval(() => {
        chrome.tabs.query({}, function (tabs) {
            console.log(tabs);
            if (currentTab < tabs.length) {
                chrome.tabs.update(tabs[currentTab].id, { highlighted: true, active: true });
                console.log("Setting tab highlight", currentTab);
                currentTab++;
            }
            else {
                console.log("Setting tab to zero");
                currentTab = 0;
            }
        });
    }, 10000);
    chrome.storage.local.set({ "is_running": true }).then(() => {
        console.log("Value is_running is set to " + true);
    });
    chrome.action.setIcon({
        path: {
            "16": "images/icon-stop-16.png",
            "24": "images/icon-stop-24.png",
            "32": "images/icon-stop-32.png",
            "64": "images/icon-stop-64.png",
            "128": "images/icon-stop-128.png"
        }
    });
}

const stopLooping = () => {
    console.log("Clearing the timer");
    clearInterval(timer);
    timer = null;
    chrome.storage.local.set({ "is_running": false }).then(() => {
        console.log("Value is_running is set to " + false);
    });
    chrome.action.setIcon({
        path: {
            "16": "images/icon-16.png",
            "24": "images/icon-24.png",
            "32": "images/icon-32.png",
            "64": "images/icon-64.png",
            "128": "images/icon-128.png"
        }
    });
}