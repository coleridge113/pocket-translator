const tabInfo = document.getElementById('tab-info');
const kanjiListContainer = document.getElementById('kanji-list'); // UL for Kanji-Hiragana list


async function handleButtonTrigger() {
    tabInfo.textContent = "Translating...";
    kanjiListContainer.innerHTML = "";

    try {
        const clipboardText = await navigator.clipboard.readText();
        // const translatedText = await translateClipboardText(clipboardText);

        chrome.runtime.sendMessage({ action: 'translateClipboardText', data: clipboardText }, (response) => {
            const translatedText = response.data;

            // Extract Kanji-Hiragana list if present
            const kanjiMatches = translatedText.match(/(.+?)\s-\s(.+)/g);

            let translationOnly = translatedText;
            if (kanjiMatches) {
                translationOnly = translatedText.split("\n").filter(line => !line.includes("  - ")).join("\n");
                kanjiMatches.forEach(pair => {
                    const li = document.createElement("li");
                    li.textContent = pair;
                    kanjiListContainer.appendChild(li);
                });
            }

            tabInfo.innerHTML = translationOnly.replace(/\n/g, "<br>");
        })
    } catch (err) {
        tabInfo.textContent = `Error: ${err.message}`;
    }
}

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
