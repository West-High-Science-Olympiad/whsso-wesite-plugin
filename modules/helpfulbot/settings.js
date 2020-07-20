/*
    WHSSO Website Plugin: for custom frontend interface modification and
    educational/competitive projects requiring a home on the website
    Copyright (C) 2020  WHSSO

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function launchHelpfulBot() {
    document.getElementById("hbot-status-text").innerHTML = "Launching...";
    document.getElementById("hbot-status-text").style.color = "";
    var buttons = document.getElementsByClassName("whsso-hbot-onoff-button");
    document.getElementsByClassName("whsso-hbot-on-button")[0].disabled = true;
    document.getElementsByClassName("whsso-hbot-off-button")[0].disabled = true;
}

function killHelpfulBot() {
    document.getElementById("hbot-status-text").innerHTML = "Terminating...";
    document.getElementById("hbot-status-text").style.color = "";
    var buttons = document.getElementsByClassName("whsso-hbot-onoff-button");
    document.getElementsByClassName("whsso-hbot-on-button")[0].disabled = true;
    document.getElementsByClassName("whsso-hbot-off-button")[0].disabled = true;
}

function finishedLaunchingHelpfulBot() {
    document.getElementById("hbot-status-text").innerHTML = "Running";
    document.getElementById("hbot-status-text").style.color = "#1fbf00";
    var buttons = document.getElementsByClassName("whsso-hbot-onoff-button");
    document.getElementsByClassName("whsso-hbot-on-button")[0].disabled = true;
    document.getElementsByClassName("whsso-hbot-off-button")[0].disabled = false;
}

function finishedKillingHelpfulBot() {
    document.getElementById("hbot-status-text").innerHTML = "Stopped";
    document.getElementById("hbot-status-text").style.color = "#ff0000";
    var buttons = document.getElementsByClassName("whsso-hbot-onoff-button");
    document.getElementsByClassName("whsso-hbot-on-button")[0].disabled = false;
    document.getElementsByClassName("whsso-hbot-off-button")[0].disabled = true;
}