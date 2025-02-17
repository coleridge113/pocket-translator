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
            const translatedText = response.data;

            // Extract Kanji-Hiragana list if present
            // const kanjiMatches = translatedText.match(/(.+?)\s-\s(.+)/g);

            // let translationOnly = translatedText;
            // if (kanjiMatches) {
            //     translationOnly = translatedText.split("\n").filter(line => !line.includes("  - ")).join("\n");
            //     kanjiMatches.forEach(pair => {
            //         const li = document.createElement("li");
            //         li.textContent = pair;
            //         kanjiListContainer.appendChild(li);
            //     });
            // }

            tabInfo.innerHTML = translatedText;
        })
    } catch (err) {
        tabInfo.textContent = `Error: ${err.message}`;
    }
}