// const { exec } = require("child_process");

const apiKey = "AIzaSyCvTqd-N9v1ZkX_0upq1JM_TdZN4xi9kqw";
var settingsObj = {
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
                    If English text, translate to Japanese. If text is neither English nor Japanese, then don't translate.
                    Just give me the translation. ${settingsObj['list-kanji']}.
                    Text: ${clipboardText}
                    `;


        if (settingsObj['list-kanji']) {
            prompt += settingsObj['list-kanji'];
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
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

        initializeSettings();

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
                        Additionally, if text has kanji, provide a breakdown of ONLY THE KANJI WORDS in this format. 
                        STRICTLY INCLUDE the <br>'s in your response:

                        <br><br>
                        KANJI-ONLY-word-1 - hiragana reading OF KANJI<br>
                        KANJI-ONLY-word-2 - hiragana reading OF KANJI<br>
                        KANJI-ONLY-word-3 - hiragana reading OF KANJI<br>
                        KANJI-ONLY-word-nth - hiragana reading OF KANJI<br>
                        `;
    }

    return string;
}

function initializeSettings() {
    settingsObj = {
        'include-source': false,
        'list-kanji': '',
    };
}

function callPython(text) {
    const command = `python fugashi.py "${text}"`;
    execcommand(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        return stdout;
    });
}