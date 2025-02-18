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
        let prompt = `Detect whether text is in English or Japanese. If Japanese text, translate to English. 
                    If English text, translate to Japanese. If text is neither English nor Japanese, then don't translate. Don't say anything else.
                    Just give me the translation.
                    Text: ${clipboardText}
                    `;

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

        let res = data.candidates?.[0]?.content?.parts?.[0]?.text || "No translation found.";

        let flag = true;
        if (flag) {
            res += `<br><br>${clipboardText}`;
        }

        return res;
    } catch (error) {
        console.error("Translation error:", error);
        return `Error: ${error.message}`;
    }
}
