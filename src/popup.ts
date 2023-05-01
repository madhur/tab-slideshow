chrome.storage.local.get(["default_interval"]).then((result) => {
    console.log("Value currently default_interval is " + result.key);
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

const start_stop = () => {

    chrome.runtime.sendMessage('start_stop', (response) => {
        // 3. Got an asynchronous response with the data from the service worker
        console.log('received user data', response);
    });
}


document.addEventListener('DOMContentLoaded', function () {
    let selectedElement = (document.querySelector('input[name="interval"]:checked') as HTMLInputElement);
    let selectedInterval;
    if (selectedElement) {
        selectedInterval = selectedElement.value;
    }
    else {
        selectedInterval = 10
    }
    let btn = document.getElementById('startButton');
    btn.className = "start"
    btn.addEventListener('click', function () {
        start_stop();
        chrome.storage.local.set({ "default_interval": selectedInterval }).then(() => {
            console.log("Value default_interval is set to " + selectedInterval);
        });
        updateButtonValue(btn);
    });

    chrome.storage.local.get(["is_running"]).then((result) => {
        console.log("Value is_running is: " + result.is_running);
        if (result.is_running) {
            btn.textContent = "Stop"
            btn.className = "stop";
        }
        else {
            btn.textContent = "Start"
            btn.className = "start";

        }

    });
});

const updateButtonValue = (btn) => {
    console.log(btn.textContent);
    if (btn.textContent == "Start") {
        btn.textContent = "Stop"
        btn.className = "stop";
    }
    else {
        btn.textContent = "Start"
        btn.className = "start";
    }

}