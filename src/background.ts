//Clear the flag on startup
import { getObjectFromLocalStorage, saveObjectInLocalStorage } from './storage-api';

chrome.runtime.onStartup.addListener(function () {
    startup();
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    handleMessage(message, _sender, sendResponse);
});

const startup = async () => {
    console.log("Back: clearing the is_running flag at startup");
    await saveObjectInLocalStorage({ "is_running": false });
    console.log("Back: Value is_running is set to " + false);
}

const handleMessage = async (message, _sender, sendResponse) => {
    if (message === 'start_stop') {
        const result = await getObjectFromLocalStorage("is_running") as any;
        console.log("Back: Value is_running is: " + JSON.stringify(result));
        if (result) {
            stopLooping();
            sendResponse("Detected running, stopping");
        }
        else {
            startLooping();
            sendResponse("Detected stopped, running");
        }

    }
}

let timer;
const startLooping = async () => {
    console.log("Going to start looping");
    let currentTab = 0;
    if (timer != null) {
        console.error("Back: Timer is already running, not starting");
        await saveObjectInLocalStorage({ "is_running": false });
        console.log("Back: Value is_running is set to " + false);
        return;
    }
    timer = setInterval(() => {
        chrome.tabs.query({}, function (tabs) {
            console.log(tabs);
            if (currentTab < tabs.length) {
                chrome.tabs.update(tabs[currentTab].id, { highlighted: true, active: true });
                console.log("Back: Setting tab highlight", currentTab);
                currentTab++;
            }
            else {
                console.log("Back: Setting tab to zero");
                currentTab = 0;
            }
        });
    }, 10000);
    await saveObjectInLocalStorage({ "is_running": true });
    console.log("Back: Value is_running is set to " + true);
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

const stopLooping = async () => {
    console.log("Back: Clearing the timer");
    clearInterval(timer);
    timer = null;
    await saveObjectInLocalStorage({ "is_running": false });
    console.log("Back: Value is_running is set to " + false);
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