chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getActiveTabInfo") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            sendResponse({
                title: activeTab.title
            })
        })

        return true;
    }
})
