document.querySelector(".search-button").addEventListener("click", () => {
    const inputValue = document.getElementById("input-panel").value;
    const zipcodeRegex = /(^\d{6}$)/;

    if (inputValue && zipcodeRegex.test(inputValue)) {
        storeZipcode(inputValue);
    }
});

document.getElementById("45plus-mode").addEventListener("click", (event) => {
    chrome.storage.sync.set(
        { seniorMode: event.target.checked },
        function () {}
    );
});

document.getElementById("toggle-switch").addEventListener("click", (event) => {
    chrome.storage.sync.set(
        { toggleSwitch: event.target.checked },
        function () {}
    );
});

function getInfo() {
    chrome.storage.sync.get(["pincode", "seniorMode", "toggleSwitch"], function (result) {
        const { pincode, seniorMode, toggleSwitch } = result;
        document.getElementById("45plus-mode").checked = seniorMode;
        document.getElementById("toggle-switch").checked = toggleSwitch;

        if (pincode) {
            document.querySelector(".message").innerHTML =
                "Currently Monitoring for" + pincode;
        }
    });
}

function storeZipcode(value) {
    chrome.storage.sync.set({ pincode: value }, function () {});
}

getInfo();
