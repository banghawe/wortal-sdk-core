let id = "";

function notificationsScheduleAsync() {
    const payload = {
        title: "Test",
        body: "Test",
    };
    Wortal.notifications.scheduleAsync(payload)
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function notificationsGetHistoryAsync() {
    Wortal.notifications.getHistoryAsync()
        .then(result => {
            appendText(JSON.stringify(result));
            if (result.length > 0) {
                id = result[0].id;
            }
        })
        .catch(error => appendText(error));
}

function notificationsCancelAsync() {
    Wortal.notifications.cancelAsync(id)
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function notificationsCancelAllAsync() {
    Wortal.notifications.cancelAllAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}
