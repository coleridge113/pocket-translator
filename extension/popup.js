document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: "getActiveTabInfo" }, (response) => {
        if (response) {
            document.getElementById('tab-info').textContent = response.title
        } else {
            document.getElementById('tab-info').textContent = "Unable to fetch"
        }
    })
})