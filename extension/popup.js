const tabInfo = document.getElementById('tab-info');
const radioForm = document.getElementById('radio-btns');

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

function getTranslationMode() {
    let selectedMode;
    for (const radioBtn of radioForm){
        if(radioBtn.checked){
            selectedMode = radioBtn.value;
            break;
        } else {
            selectedMode = '';
        }
    }
    console.log(selectedMode);
    return selectedMode;
}

async function handleButtonTrigger() {
    tabInfo.textContent = "Translating...";
    // const translateMode = getTranslationMode();

    try {
        const clipboardText = await navigator.clipboard.readText();

        chrome.runtime.sendMessage({ action: "translateClipboardText", data: [clipboardText, getTranslationMode()] }, (response) => {
            tabInfo.innerHTML = response.data;
        })
    } catch (err) {
        tabInfo.textContent = `Error: ${err.message}`;
    }
}