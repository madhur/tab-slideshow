chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    if (message === 'start') {
        sendResponse("hellow");
        startLooping();
    }
    else if (message === "stop") {
        sendResponse("world");
        stopLooping();
    }
});

let timer;
const startLooping = () => {

    let currentTab = 0;
    timer = setInterval(() => {
        chrome.tabs.query({}, function (tabs) {
            console.log(tabs);
            if (currentTab < tabs.length) {
                chrome.tabs.update(tabs[currentTab].id, { highlighted: true });
                console.log("Setting tab highlight", currentTab);
                currentTab++;
            }
            else {
                console.log("Setting tab to zero");
                currentTab = 0;
            }
        });
    }, 10000);
    chrome.storage.session.set({ "is_running": true }).then(() => {
        console.log("Value is set to " + true);
    });
}

const stopLooping = () => {
    console.log("Clearing the timer");
    clearInterval(timer);
    chrome.storage.session.set({ "is_running": stop }).then(() => {
        console.log("Value is set to " + true);
    });
}