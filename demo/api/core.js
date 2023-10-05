let mock_email = "mock@email.com";
let mock_username = "mock_user";
let mock_password = "mock_password";

function coreAuthenticateAsyncPrompt() {
    Wortal.authenticateAsync()
        .then(result => appendText("Auth result: " + result.status))
        .catch(error => appendText(error));
}

function coreAuthenticateAsyncRegister() {
    const payload = {
        action: "register",
        email: mock_email,
        username: mock_username,
        password: mock_password,
    }

    Wortal.authenticateAsync(payload)
        .then(result => appendText("Auth result: " + result.status))
        .catch(error => appendText(error));
}

function coreAuthenticateAsyncLogin() {
    const payload = {
        action: "login",
        email: mock_email,
        password: mock_password,
    }

    Wortal.authenticateAsync(payload)
        .then(result => appendText("Auth result: " + result.status))
        .catch(error => appendText(error));
}

function coreAuthenticateAsyncReset() {
    const payload = {
        action: "reset",
        email: mock_email,
    }

    Wortal.authenticateAsync(payload)
        .then(result => appendText("Auth result: " + result.status))
        .catch(error => appendText(error));
}

function coreLinkAccountAsync() {
    Wortal.linkAccountAsync()
        .then(result => appendText("Link account result: " + result))
        .catch(error => appendText(error));
}

function coreOnPause() {
    Wortal.onPause(() => appendText('Paused'));
}

function corePerformHapticFeedbackAsync() {
    Wortal.performHapticFeedbackAsync()
        .then(result => appendText(JSON.stringify(result)))
        .catch(error => appendText(error));
}

function coreGetSupportedAPIs() {
    const supportedAPIs = Wortal.getSupportedAPIs();
    appendText(supportedAPIs);
}
