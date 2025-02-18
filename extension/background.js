const apiKey = "AIzaSyDJdtrcFr36QABN67S-F7qvPIW3mqKxKAQ";
const settingsObj = {
    'list-kanji': '',
};

// Chrome comms to front-end
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "translateClipboardText") {
        translateClipboardText(request.data['clipboardText'], request.data['settings']).then(response => {
            sendResponse({ data: response });
        }).catch(err => {
            sendResponse({ data: err });
        });
        return true;
    }
})

// Main translate function
async function translateClipboardText(clipboardText, settings) {
    checkSettings(clipboardText, settings);

    try {
        let prompt = `Detect whether text is in English or Japanese. If Japanese text, translate to English. 
                    If English text, translate to Japanese. If text is neither English nor Japanese, then don't translate. Don't say anything else.
                    Just give me the translation. ${settings['kanji-list']}.
                    Text: ${clipboardText}
                    `;

        // let prompt = `Just translate. Don't say anything else. If Japanese text, translate to English. 
        //             If English text, translate to Japanese. Text: ${clipboardText}`;

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

        let translation = data.candidates?.[0]?.content?.parts?.[0]?.text || "No translation found.";
        translation += settingsObj['include-source'];
        settingsObj['include-source'] = '';

        return translation;

    } catch (error) {
        console.error("Translation error:", error);
        return `Error: ${error.message}`;
    }
}


function checkSettings(clipboardText, settings) {
    let string = '';

    if (settings.length === 0) {
        return;
    }

    if (settings['include-source']) {
        settingsObj['include-source'] = `<br><br>${clipboardText}`;
    }

    if (settings['list-kanji']) {
        settingsObj['list-kanji'] = `
                        If text has kanji, provide a breakdown in this format:

                        <br>
                        kanji-1 - hiragana reading<br>
                        kanji-2 - hiragana reading<br>
                        kanji-3 - hiragana reading<br>
                        kanji-n - hiragana reading<br>
                        `;
    }

    return string;
}
