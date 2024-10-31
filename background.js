chrome.runtime.onInstalled.addListener(function() {
    console.debug("onInstalled()");

    chrome.action.setBadgeBackgroundColor({ color: "yellow" });

    chrome.storage.sync.get("commisionRate", function(result) {
        if (result) {
             setBadge(result.commisionRate);
        }
    });

    chrome.storage.sync.get("enableExtension", function(result) {
        console.debug("!!! enableExtension", result);

        if (result) {
            setExtensionState(result.enableExtension);
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.debug("onMessage(): ", message, sender);
    
    if (message.type === "commision-rate-changed") {
        chrome.storage.sync.set({"commisionRate": message.commisionRate});

        //let tab = getActiveTab();
        //console.debug(tab);
        //chrome.tabs.sendMessage(tab.id, {type: "commision-rate-changed"});  

        setBadge(message.commisionRate);
    }
    else if (message.type === "show-base-price-changed") {
        chrome.storage.sync.set({"showBasePrice": message.value});
    }
    else if (message.type === "enable-extension-changed") {
        chrome.storage.sync.set({"enableExtension": message.value});
        setExtensionState(message.value)
    }
    else if (message.type === "page-loaded") {
        let url = sender.url;
        //let url = "https://onebid.pl/pl/live/2343/lot/5245";

        var match = url.match("\/live\/(?<AuctionNo>\\d+)\/");
        if (!match) {
            console.error("Failed to determine auction number from URL!");
            return;
        }

        var auctionNo = match.groups.AuctionNo;
        console.info("AuctionNo: ", auctionNo);
        
        chrome.storage.sync.set({"auctionNo": auctionNo});
    }
});

async function getActiveTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);

    return tab;
}

function saveSettings() {
    chrome.storage.sync.set({appSettings: settings});
}

function setBadge(commisionRate) {
    let tab = getActiveTab();

    chrome.action.setBadgeText({
            text: commisionRate.toString(), 
            tabId: tab.id
        });
}

function setExtensionState(isEnabled) {
    let tab = getActiveTab();
    let color = (isEnabled) ? "yellow" : "gray";

    chrome.action.setBadgeBackgroundColor({
            color: color,
            tabId: tab.id
        });
}