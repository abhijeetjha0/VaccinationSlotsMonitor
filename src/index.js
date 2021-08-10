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

document.getElementById("covishield").addEventListener("click", (event) => {
    chrome.storage.sync.set(
        { covishield: event.target.checked },
        function () {}
    );
});

document.getElementById("covaxin").addEventListener("click", (event) => {
    chrome.storage.sync.set(
        { covaxin: event.target.checked },
        function () {}
    );
});

document.getElementById("toggle-switch").addEventListener("click", (event) => {
    chrome.storage.sync.set(
        { toggleSwitch: event.target.checked },
        function () {}
    );
});

document.getElementsByName("dose").forEach((element) => {
    element.addEventListener("click", (event) => {
        chrome.storage.sync.set(
            { doseNumber: event.target.id },
            function () {}
        );
    });
})

function getInfo() {
    chrome.storage.sync.get(["pincode", "seniorMode", "toggleSwitch", "doseNumber", "covishield", "covaxin"], function (result) {
        const { pincode, seniorMode, toggleSwitch, doseNumber, covishield, covaxin } = result;
        document.getElementById("45plus-mode").checked = seniorMode;
        document.getElementById("toggle-switch").checked = toggleSwitch;
        document.getElementById("covishield").checked = covishield;
        document.getElementById("covaxin").checked = covaxin;
        document.getElementById(`${doseNumber ? doseNumber: "dose1"}`).checked = true;

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
