const apiKey = "AIzaSyDJdtrcFr36QABN67S-F7qvPIW3mqKxKAQ";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "translateClipboardText") {
        translateClipboardText(request.data).then(response => {
            sendResponse({ data: response });
        }).catch(err => {
            sendResponse({ data: err });
        });
        return true;
    }
})

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

