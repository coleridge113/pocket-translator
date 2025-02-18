const tabInfo = document.getElementById('tab-info');
const settingsBtn = document.getElementById('settings-btn');
const closeDg = document.getElementById('close-dg');
const settingsWindow = document.getElementById('settings-window');
const CLOSE_TIMEOUT = 300;

settingsBtn.addEventListener('click', () => {
    settingsWindow.showModal();
    settingsWindow.classList.add('open');
})

closeDg.addEventListener('click', () => {
    settingsWindow.classList.remove('open');
    settingsWindow.classList.add('close');
    setTimeout(() => {
        settingsWindow.classList.remove('close');
        settingsWindow.close();
    }, CLOSE_TIMEOUT);
})

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