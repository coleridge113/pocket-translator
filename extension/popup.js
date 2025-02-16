const apiKey = "AIzaSyDJdtrcFr36QABN67S-F7qvPIW3mqKxKAQ";
const tabInfo = document.getElementById('tab-info');
const kanjiListContainer = document.getElementById('kanji-list'); // UL for Kanji-Hiragana list

async function translateClipboardText(clipboardText) {
    try {
        const detectedLanguage = await detectLanguage(clipboardText);
        console.log("Detected Language:", detectedLanguage);

        let prompt;
        if (detectedLanguage === "Japanese") {
            prompt = `Translate the following Japanese text to English: ${clipboardText}`;

        } else if (detectedLanguage === "English") {
            prompt = `Translate this to Japanese: ${clipboardText}`;
        } else {
            throw new Error("Unable to detect language.");
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("API Error Response:", data);
            throw new Error(`API Error: ${data.error?.message || response.statusText}`);
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No translation found.";
    } catch (error) {
        console.error("Translation error:", error);
        return `Error: ${error.message}`;
    }
}

async function detectLanguage(text) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Detect the language of this text and respond with only "English" or "Japanese": ${text}` }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Language Detection Error:", data);
            throw new Error("Failed to detect language.");
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Unknown";
    } catch (error) {
        console.error("Language detection error:", error);
        return "Unknown";
    }
}

async function handleButtonTrigger() {
    tabInfo.textContent = "Translating...";
    kanjiListContainer.innerHTML = ""; // Clear previous Kanji-Hiragana list

    try {
        const clipboardText = await navigator.clipboard.readText();
        const translatedText = await translateClipboardText(clipboardText);

        // Extract Kanji-Hiragana list if present
        const kanjiMatches = translatedText.match(/(.+?)\s-\s(.+)/g); // Matches "Kanji - Hiragana" format

        let translationOnly = translatedText;
        if (kanjiMatches) {
            translationOnly = translatedText.split("\n").filter(line => !line.includes("  - ")).join("\n"); // Remove Kanji-Hiragana lines
            kanjiMatches.forEach(pair => {
                const li = document.createElement("li");
                li.textContent = pair;
                kanjiListContainer.appendChild(li);
            });
        }

        tabInfo.innerHTML = translationOnly.replace(/\n/g, "<br>"); // Display translation in tabInfo
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
