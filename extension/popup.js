const apiKey = "AIzaSyDJdtrcFr36QABN67S-F7qvPIW3mqKxKAQ";
const tabInfo = document.getElementById('tab-info');

async function translateClipboardText(clipboardText) {
    try {
        const detectedLanguage = await detectLanguage(clipboardText);
        console.log("Detected Language:", detectedLanguage);

        let prompt;
        if (detectedLanguage === "Japanese") {
            prompt = "Translate this to English: " + clipboardText;
        } else {
            prompt = "Translate this to Japanese: " + clipboardText;
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
        return "Unknown";
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Unknown";
}

handleButtonTrigger = async () => {
    tabInfo.textContent = "Translating..."
    try {
        const clipboardText = await navigator.clipboard.readText();
        const translatedText = await translateClipboardText(clipboardText);
        tabInfo.textContent = translatedText;
    } catch (err) {
        tabInfo.textContent = `Error: ${err.message}`;
    }
}

document.getElementById('btn').addEventListener('click', async (event) => {
    event.preventDefault();
    handleButtonTrigger();
});

document.addEventListener('keydown', async (event) => {
    if (event.key === ' ') {
        handleButtonTrigger();
    }
})