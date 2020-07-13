function launchHelpfulBot() {
    document.getElementById("hbot-status-text").innerHTML = "Launching...";
    setHbotOnoffControlsDisabled(true);
}

function killHelpfulBot() {
    document.getElementById("hbot-status-text").innerHTML = "Terminating...";
    setHbotOnoffControlsDisabled(true);
}

function finishedLaunchingHelpfulBot() {
    document.getElementById("hbot-status-text").innerHTML = "Running";
    setHbotOnoffControlsDisabled(false);
}

function finishedKillingHelpfulBot() {
    document.getElementById("hbot-status-text").innerHTML = "Stopped";
    setHbotOnoffControlsDisabled(false);
}

function setHbotOnoffControlsDisabled(value) {
    var buttons = document.getElementsByClassName("whsso-hbot-onoff-button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = value;
    }
}