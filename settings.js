document.addEventListener("DOMContentLoaded", function() {
    var amountRange = document.getElementById("amountRange");
    var amountValue = document.getElementById("amountValue");

    amountRange.oninput = function(){
        amountValue.value = amountRange.value;
        const commisionRate = parseInt(amountValue.value, 10);
        sendMessageCommisionRateChanged(commisionRate);
    };

    amountValue.oninput = function(){
        amountRange.value = amountValue.value;
    };

    chrome.storage.sync.get("commisionRate", function(result) {
        if (result) {
            amountRange.value = result.commisionRate;
            amountValue.value = result.commisionRate;
        }
    });

    var enableExtensionCheckBox = document.getElementById("enableExtension");

    chrome.storage.sync.get("enableExtension", function(result) {
        if (result) {
            enableExtensionCheckBox.checked = result.enableExtension;
        }
    });

    enableExtensionCheckBox.addEventListener("change", e => {
        onEnableExtensionChanged(e.target.checked);
    });

    var hideBasePriceCheckBox = document.getElementById("hideBasePrice");
    hideBasePriceCheckBox.addEventListener("change", e => {
        onShowBasePriceChanged(e.target.checked);
    });

    onSettingsPopupOpened();
});

function onHideBasePriceChecked() {
    console.debug("`onHideBasePriceChecked` event fired.")
}

function onSettingsPopupOpened() {
    sendMessageSettingsPopupOpened();
}

function onShowBasePriceChanged(show) {
    sendMessageShowBasePriceChanged(show);
}

function onEnableExtensionChanged(enable) {
    sendMessageEnableExtensionChanged(enable);
}