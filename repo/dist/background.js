function monitor() {
    getResults();

    setInterval(() => {
        getResults();
    }, 60000);
}

function getResults() {
    chrome.storage.sync.get(["pincode", "seniorMode", "toggleSwitch"], function (result) {
        const { pincode, seniorMode, toggleSwitch } = result;

        if (pincode && toggleSwitch) {
            const currentDate = returnTodayDate();
            hitCowinApi(currentDate, pincode, seniorMode);
        }
    });
}

function hitCowinApi(date, pincode, seniorMode) {
    const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${date}`;
    const age = seniorMode ? 45 : 18;

	console.log("hitting api");

    fetch(url)
        .then((response) => response.json())
        .then((response) => {
            const { centers } = response;

            if (centers && centers.length) {
                centers.forEach((center) => {
                    const { sessions, name, fee_type: fee } = center;

                    if (sessions && sessions.length) {
                        sessions.forEach((session) => {
                            const {
                                date,
                                available_capacity: slots,
                                min_age_limit: minAge,
                            } = session;

                            if (slots && minAge === age) {
                                showNotification(name, fee, date, slots);
                            }
                        });
                    }
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

function showNotification(name, fee, date, seats) {
    console.log("Notified");
    chrome.notifications.create("", {
        title: "Vaccination Slots Monitor",
        message: `${seats} seats are available at ${name} on ${date} for ${fee}`,
        type: "basic",
        iconUrl: "check.png",
    });
}

function returnTodayDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    return dd + "-" + mm + "-" + yyyy;
}

monitor();

function showSampleNotification() {
    chrome.notifications.create("", {
        title: "Vaccination Slots Monitor",
        message: `Application started successfully and this is how you will be notified`,
        type: "basic",
        iconUrl: "check.png",
    });
}

showSampleNotification();
