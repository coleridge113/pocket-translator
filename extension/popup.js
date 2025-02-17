const tabInfo = document.getElementById('tab-info');
const settingsBtn = document.getElementById('settings-btn');
const closeDg = document.getElementById('close-dg');
const settingsBox = document.getElementById('settings-box');

settingsBtn.addEventListener('click', () => {
    settingsBox.showModal();
    settingsBox.classList.add('open');
})

closeDg.addEventListener('click', () => {
    settingsBox.classList.remove('open');
    settingsBox.classList.add('close');
    setTimeout(()=>{
        settingsBox.classList.remove('close');
        settingsBox.close();
    }, 300);
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
            tabInfo.innerHTML = `
                ${response.data}
                <br>
                <br>
                ${clipboardText}
            `;

        })
    } catch (err) {
        tabInfo.textContent = `Error: ${err.message}`;
    }
}