import { getObjectFromLocalStorage, saveObjectInLocalStorage } from './storage-api';

const popup = (async (document) => {

    const result = await getObjectFromLocalStorage("default_interval") as any;
    console.log("Popup: Value currently default_interval is " + + JSON.stringify(result));
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
            intervalSelector.value = result;
        }
    }



});

const start_stop = () => {

    chrome.runtime.sendMessage('start_stop', (response) => {
        // 3. Got an asynchronous response with the data from the service worker
        console.log('received user data', response);
    });
}

window.addEventListener('load', async  () => {
    let selectedElement = (document.querySelector('input[name="interval"]:checked') as HTMLInputElement);
    let selectedInterval;
    if (selectedElement) {
        selectedInterval = selectedElement.value;
    }
    else {
        selectedInterval = 60
    }
    let btn = document.getElementById('startButton');
    btn.className = "start"
    btn.addEventListener('click', async()=> {
        start_stop();
        await saveObjectInLocalStorage({ "default_interval": selectedInterval });
        console.log("Popup: Value default_interval is set to " + selectedInterval);
        updateButtonValue(btn);
    });

    const result = await getObjectFromLocalStorage("is_running") as any;
    console.log("Popup: Value is_running is: " + JSON.stringify(result));
    if (result) {
        btn.textContent = "Stop"
        btn.className = "stop";
    }
    else {
        btn.textContent = "Start"
        btn.className = "start";

    }

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

popup(document);