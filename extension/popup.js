const tabInfo = document.getElementById('tab-info');

document.getElementById('btn').addEventListener('click', async (event) => {
    event.preventDefault();
    handleButtonTrigger();
});

let spaceKeyPressed = false;
document.addEventListener('keydown', async (event) => {
    if (event.key === ' ' && !spaceKeyPressed) {
        spaceKeyPressed = true;
        handleButtonTrigger();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === ' ') {
        spaceKeyPressed = false;
    }
});

async function handleButtonTrigger() {
    tabInfo.textContent = "Translating...";

    try {
        const clipboardText = await navigator.clipboard.readText();

        chrome.runtime.sendMessage({ action: "translateClipboardText", data: clipboardText }, (response) => {
            tabInfo.innerHTML = response.data;
        })
    } catch (err) {
        tabInfo.textContent = `Error: ${err.message}`;
    }
}