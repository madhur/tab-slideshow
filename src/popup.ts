chrome.storage.local.get(["default_interval"]).then((result) => {
    console.log("Value currently is " + result.key);
    if (!result) {
        const ele = document.getElementById("10sec") as HTMLInputElement;
        ele.checked = true;
    }
    else {
        let ele = document.getElementById(result + "sec") as HTMLInputElement;
        if (ele == null) {
            ele = document.getElementById("custom") as HTMLInputElement;
            ele.checked = true;
            const intervalSelector = document.getElementById("customval") as HTMLInputElement;
            intervalSelector.value = result.key;
        }
    }
});

const start = () => {

    chrome.runtime.sendMessage('start', (response) => {
        // 3. Got an asynchronous response with the data from the service worker
        console.log('received user data', response);
    });
}


document.addEventListener('DOMContentLoaded', function () {
    let selectedInterval = document.querySelector('input[name="interval"]:checked').value;
    var btn = document.getElementById('startButton');
    btn.addEventListener('click', function () {
        start();
        chrome.storage.local.set({ "default_interval": selectedInterval }).then(() => {
            console.log("Value is set to " + selectedInterval);
        });
    });
});