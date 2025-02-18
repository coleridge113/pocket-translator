const tabInfo = document.getElementById('tab-info');
const settingsBtn = document.getElementById('settings-btn');
const closeDg = document.getElementById('close-dg');
const settingsWindow = document.getElementById('settings-window');

const CLOSE_TIMEOUT = 300;

// Show modal event listener
settingsBtn.addEventListener('click', () => {
    settingsWindow.showModal();
    settingsWindow.classList.add('open');
})

// Close modal event listener
closeDg.addEventListener('click', () => {
    settingsWindow.classList.remove('open');
    settingsWindow.classList.add('close');
    setTimeout(() => {
        settingsWindow.classList.remove('close');
        checkCheckboxes();
        settingsWindow.close();
    }, CLOSE_TIMEOUT);
})

// Translation button trigger
document.getElementById('btn').addEventListener('click', async (event) => {
    event.preventDefault();
    handleButtonTrigger();
});

// Shortcut translation button trigger
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

// Handle button trigger function
async function handleButtonTrigger() {
    tabInfo.textContent = "Translating...";

    try {
        const clipboardText = await navigator.clipboard.readText();
        checkCheckboxes();
        let dataObj = {
            'clipboardText': clipboardText,
            'settings': checkCheckboxes()
        }

        chrome.runtime.sendMessage({ action: "translateClipboardText", data: dataObj }, (response) => {
            tabInfo.innerHTML = response.data;
        })
    } catch (err) {
        tabInfo.textContent = `Error: ${err.message}`;
    }
}

// Check checkbox function
function checkCheckboxes() {
    const checkboxObj = {};
    const checkboxes = document.getElementsByClassName('cb-settings');
    
    if (checkboxes.length === 0) {
        return checkboxObj;
    }

    Array.from(checkboxes).forEach((checkbox) => {
        checkboxObj[checkbox.name] = checkbox.checked;
    });

    return checkboxObj;
}