// document.addEventListener('DOMContentLoaded', () => {
//     chrome.runtime.sendMessage({ action: "getActiveTabInfo" }, (response) => {
//         if (response) {
//             document.getElementById('tab-info').textContent = response.clipboardText;
//         } else {
//             document.getElementById('tab-info').textContent = "Unable to fetch";
//         }
//     })
// })

const apiKey = "AIzaSyDJdtrcFr36QABN67S-F7qvPIW3mqKxKAQ"
const toEngPrompt = "translate this to English: ";
const toJapPrompt = "translate this to Japanese: ";


document.getElementById('btn').addEventListener('click', async (event) => {
    event.preventDefault();

    try {
        const clipboardText = await navigator.clipboard.readText();

        const translatedText = await translateClipboardText(clipboardText);
        document.getElementById('tab-info').textContent = translatedText;
    } catch (err) {
        document.getElementById('tab-info').textContent = `Error: ${err.message}`;
    }
});


async function translateClipboardText(clipboardText) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Translate this to English: " + clipboardText }]
                }]
            })
        });

        const data = await response.json(); // Parse response as JSON

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
