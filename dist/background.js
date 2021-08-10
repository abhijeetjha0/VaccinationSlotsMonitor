function monitor() {
    getResults();

    setInterval(() => {
        getResults();
    }, 60000);
}

function getResults() {
    chrome.storage.sync.get(["pincode", "seniorMode", "toggleSwitch", "doseNumber", "covishield", "covaxin"], function (result) {
        const { pincode, seniorMode, toggleSwitch, doseNumber, covishield, covaxin } = result;
        const vaccineName = `${covishield ? "COVISHIELD": ""}${covaxin ? "COVAXIN": ""}`;

        if (pincode && toggleSwitch) {
            const currentDate = returnTodayDate();

            hitCowinApi(currentDate, pincode, seniorMode, doseNumber, vaccineName);
        }
    });
}

function hitCowinApi(date, pincode, seniorMode, doseNumber, vaccineName) {
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
                                min_age_limit: minAge,
                                vaccine
                            } = session;

                            const availableCapacityForDose = session[`available_capacity_${doseNumber}`];
                            const isRequiredVaccineAvailable = vaccineName.includes(vaccine);

                            if (availableCapacityForDose && minAge === age && isRequiredVaccineAvailable) {
                                showNotification(name, fee, date, availableCapacityForDose, vaccine);
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

function showNotification(name, fee, date, seats, vaccine) {
    console.log("Notified");
    chrome.notifications.create("", {
        title: "Vaccination Slots Monitor",
        message: `${seats} seats are available at ${name} of ${vaccine} on ${date} for ${fee}`,
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
