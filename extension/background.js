// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "getActiveTabInfo") {
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             var activeTab = tabs[0];

//             navigator.clipboard.readText().then((clipboardText) => {
//                 sendResponse({
//                     activeTabUrl: activeTab.url,
//                     clipboardText: clipboardText
//                 });
//             }).catch((err) => {
//                 console.error('Failed to read clipboard contents: ', err);
//                 sendResponse({
//                     activeTabUrl: activeTab.url,
//                     clipboardText: 'Error reading clipboard'
//                 });
//             });
//         });
//         return true;
//     }
// });
