(function () {
    const oldLog = console.log;
    const oldDebug = console.debug;
    const oldWarn = console.warn;
    const oldError = console.error;
    const consoleTextArea = document.getElementById('consoleTextArea');

    console.log = function (message) {
        oldLog.apply(console, arguments);
        consoleTextArea.value += message + '\n';
    };

    console.debug = function (message) {
        oldDebug.apply(console, arguments);
        consoleTextArea.value += '[DEBUG] ' + message + '\n';
    };

    console.warn = function (message) {
        oldWarn.apply(console, arguments);
        consoleTextArea.value += '[WARN] ' + message + '\n';
    };

    console.error = function (message) {
        oldError.apply(console, arguments);
        consoleTextArea.value += '[ERROR] ' + message + '\n';
    };

    document.getElementById('toggleButton').addEventListener('click', function () {
        const consoleContainer = document.getElementById('consoleContainer');
        consoleContainer.style.display = (consoleContainer.style.display === 'none') ? 'block' : 'none';
    });
})();
