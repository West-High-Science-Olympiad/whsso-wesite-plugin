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

// Create the Web Interface
const express = require("express");
const app = express();
app.use(express.static("public"));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const prefix = 'h?';
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  var setStatus = () => {client.user.setActivity('h?commands', { type: 'LISTENING' });};
  setInterval(setStatus, 1000 * 60 * 60 * 8);
  setStatus();
});

// Extra dependencies
const moment = require("moment");
require("moment-timezone");

var commandinfo = new Discord.MessageEmbed()
  .setColor('#ffb800')
  .setTitle('Helpful Bot Commands');
var periodicinfo = '**Periodic actions:**\n```\n';

// Register every command name with a javascript function
const commands = new Map();
registerCommand('ping', ping, 'Replies with "pong"');
registerCommand('ding', ding, 'Replies with "dong"');
registerCommand('dmme', dm, 'DM\'s you a greeting');
registerCommand('smash', smash, 'Outputs a random string (keyboard smash) with specified the length, default 35');
registerCommand('echo', echo, 'Repeats the argument');
registerCommand('pin', pin, 'Pins the message with the provided ID (command and message must be in the same channel)');
registerCommand('brrify', brrify, 'Randomizes the capitalization of the argument and then deletes the command');
registerCommand('put', put, 'Puts a key-value to the database');
registerCommand('get', get, 'Gets a key-value from the database');
registerCommand('periodics', periodics, 'Displays the registered periodic functions');

const dbFile = "./.data/sqlite.db";
const fs = require("fs");
const exists = fs.existsSync(dbFile);
if (!fs.existsSync("./.data")) {
  fs.mkdirSync("./.data");
}
if (!exists) {
  fs.openSync(dbFile, 'w');
}
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// database
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE KeyValue (key TEXT, value TEXT)"
    );
    console.log("New table KeyValue created!");
  }
});

db.each("SELECT * FROM KeyValue", (err, row) => {
  console.log(row);
});

client.on('message', msg => {
  if (msg == null || msg.member == null || msg.member.id == client.user.id) {
    return;
  }
  var msgcontent = msg.content;
  if (!msgcontent.startsWith(prefix)) {
    return;
  }
  var fullcommand = msgcontent.substring(prefix.length);
  var command = fullcommand.split(' ')[0];
  if (command === 'commands') {
    msg.channel.send(commandinfo);
    return;
  }
  var argument = '';
  if (fullcommand.length > command.length) {
    argument = fullcommand.substring(command.length + 1);
  }
  var func = commands.get(command);
  if (func == undefined) {
    unknownCommand(msg, argument);
  } else {
    func(msg, argument);
  }
});

const SUNDAY    = 0;
const MONDAY    = 1;
const TUESDAY   = 2;
const WEDNESDAY = 3;
const THURSDAY  = 4;
const FRIDAY    = 5;
const SATURDAY  = 6;

var periodicactions = new Map();
registerPeriodic(
  nextDayTimeGetter(TUESDAY, '13:40'),
  // messageSender('703374989457621092', 'There\'s a meeting in 20 minutes if you\'re free! Join voice for announcements!'),
  messageSender('703374989457621092', '@everyone Don\'t forget that there\'s a meeting in 20 minutes! Join voice for announcements!'),
  'Tuesday meeting reminder'
);
registerPeriodic(
  nextDayTimeGetter(TUESDAY, '14:00'),
  setChannelPerms('708445244647014410', 'everyone', {VIEW_CHANNEL: false}),
  'Hide spam channel for Tuesday meeting'
);
registerPeriodic(
  nextDayTimeGetter(TUESDAY, '16:00'),
  setChannelPerms('708445244647014410', 'everyone', {VIEW_CHANNEL: true}),
  'Reopen spam channel after Tuesday meeting'
);
registerPeriodic(
  nextDayTimeGetter(FRIDAY, '13:40'),
  // messageSender('703374989457621092', 'There\'s a meeting in 20 minutes if you\'re free! Join voice for announcements!'),
  messageSender('703374989457621092', '@everyone Don\'t forget that there\'s a meeting in 20 minutes! Join voice for announcements!'),
  'Friday meeting reminder'
);
registerPeriodic(
  nextDayTimeGetter(FRIDAY, '14:00'),
  setChannelPerms('708445244647014410', 'everyone', {VIEW_CHANNEL: false}),
  'Hide spam channel for Friday meeting'
);
registerPeriodic(
  nextDayTimeGetter(FRIDAY, '16:00'),
  setChannelPerms('708445244647014410', 'everyone', {VIEW_CHANNEL: true}),
  'Reopen spam channel after Friday meeting'
);
registerPeriodic(
  nextTimeGetter("6:00"),
  cleanServer(/*welcome channels:*/['696852006215614505', '696920456569290833'], /*Unverified role:*/'706371193640321046'),
  'Morning server permissions check'
);
registerPeriodic(
  nextTimeGetter("18:00"),
  cleanServer(/*welcome channels:*/['696852006215614505', '696920456569290833'], /*Unverified role:*/'706371193640321046'),
  'Evening server permissions check'
);

periodicinfo = periodicinfo.substring(0, periodicinfo.length - 2);
periodicinfo += '```';

var it = periodicactions.entries();
let result = it.next();
while (!result.done) {
  setTimeout(wrap(result.value[1], result.value[0]), result.value[0]());
  result = it.next();
}

client.login(process.argv[2]);

function registerCommand(name, func, desc) {
  commands.set(name, func);
  commandinfo.addField(name, desc, false);
}

function unknownCommand(msg, argument) {
  msg.reply('I\'m sorry, but your command was not recognized.')
}

function registerPeriodic(time, func, desc) {
  periodicactions.set(time, func);
  periodicinfo += desc + '\n\n';
}

// Utilities for periodic actions

function nextDayTimeGetter(day, time) {
  return function() {
    var now = moment();
    var target = moment().tz('America/Los_Angeles');
    day = ((day % 7) + 7) % 7;
    var times = time.split(":");
    var targHours = parseInt(times[0]);
    var targMins = parseInt(times[1]);
    target.set({hour:targHours,minute:targMins,second:0,millisecond:0});
    target.add(-7 + (day - target.day()), 'days');
    while (target.toDate() - now.toDate() <= 0) {
      target.add(7, 'days');
    }
    return target.toDate() - now.toDate();
  }
}

function nextTimeGetter(time) {
  return function() {
    var now = moment();
    var target = moment().tz('America/Los_Angeles');
    var times = time.split(":");
    var targHours = parseInt(times[0]);
    var targMins = parseInt(times[1]);
    target.set({hour:targHours,minute:targMins,second:0,millisecond:0});
    while (target.toDate() - now.toDate() <= 0) {
      target.add(1, 'days');
    }
    return target.toDate() - now.toDate();
  }
}

function wrap(inner, limit) {
  return function() {
    inner();
    setTimeout(wrap(inner, limit), limit());
  }
}

function messageSender(channelid, msg) {
  return function() {
    client.channels.fetch(channelid).then(function(channel) {
      channel.send(msg);
    });
  }
}

function setChannelPerms(channelid, roleid, permsset) {
  return function() {
    client.channels.fetch(channelid).then(function(channel) {
      if (roleid === 'everyone') {
        var role = channel.guild.roles.everyone;
        channel.updateOverwrite(role, permsset);
      } else {
        channel.guild.roles.fetch(roleid).then(function(role) {
          channel.updateOverwrite(role, permsset);
        });
      }
    });
  }
}

function cleanServer(welcomechannels, unverifiedroleid) {
  return function() {
    var issues = [];
    client.channels.fetch(welcomechannels[0]).then(function(wc0) {
      var channels = wc0.guild.channels;
      var everyonerole = wc0.guild.roles.everyone;
      wc0.guild.roles.fetch(unverifiedroleid).then(function(unverifiedrole) {
        for (const channel0 of channels.cache) {
          var channel = channel0[1];
          if (channel.type === 'category') {
            continue;
          }
          var Uperms = channel.permissionsFor(unverifiedrole);
          var Vperms = channel.permissionsFor(everyonerole);
          if (welcomechannels.includes(channel.id)) {
            if (!Uperms.has('VIEW_CHANNEL')) {
              issues.push(channel.name + ' was not visible to new members.');
              channel.updateOverwrite(unverifiedrole, {VIEW_CHANNEL:true});
            }
            if (Vperms.has('VIEW_CHANNEL')) {
              issues.push(channel.name + ' was visible to verified members.');
              channel.updateOverwrite(unverifiedrole, {VIEW_CHANNEL:false});
            }
          } else {
            if (Uperms.has('VIEW_CHANNEL')) {
              issues.push(channel.name + ' was visible to unverified members.');
              channel.updateOverwrite(unverifiedrole, {VIEW_CHANNEL:false});
            }
          }
        }
        var ee = '580635791013969921';
        var botchat = '708445244647014410';
        if (issues.length == 0) {
          client.channels.fetch(botchat).then(function(channel) {
            channel.send('Server security check: No problems with server security.');
          });
        } else {
          client.channels.fetch(ee).then(function(channel) {
            channel.send('Server security check: ' + issues.length + ' problems with server security found and fixed.');
            for (const issue of issues) {
              channel.send('#'+issue);
            }
          });
        }
      });
    });
  }
}

// The javascript function for each command

function ping(msg, argument) {
  msg.reply('pong');
}

function ding(msg, argument) {
  msg.reply('dong');
}

function smash(msg, argument) {
  var length = 35;
  argument = argument.split(" ")[0];
  var arg = parseInt(argument);
  if (!isNaN(arg)) {
    if (arg > 0) {
      length = arg;
    }
  }
  if (length > 1000) {
    msg.channel.send('Bruh I ain\'t spammin that much');
    return;
  }
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  msg.channel.send(result);
}

function echo(msg, argument) {
  if (argument.length > 0) {
    msg.channel.send(argument);
  } else {
    msg.channel.send('_ _');
  }
}

function dm(msg, argument) {
  var name = msg.member.nickname;
  msg.member.send('Hello ' + name.split(' ')[0] + ', it is very nice to meet you!');
}

function periodics(msg, argument) {
  msg.channel.send(periodicinfo);
}

function pin(msg, argument) {
  if (isNaN(parseInt(argument))) {
    msg.reply("Provide the message id as your argument.");
    return;
  }
  var found = false;
  msg.channel.messages.fetch(argument).then(function(message){
    message.pin();
  }, function(){
    msg.reply("Sorry, there is no message in this channel with that ID.");
  })
}

function put(msg, argument) {
  argument = argument.trim();
  if (argument.indexOf(" ") == -1 || argument.length == 0) {
    msg.channel.send("Give a key and a value, separated by spaces.");
    return;
  }
  var key = argument.split(" ")[0].toLowerCase();
  var value = argument.substring(key.length + 1);
  value = value.trim();
  if (value.length == 0) {
    msg.channel.send("Give a key and a value, separated by spaces.");
    return;
  }
  db.run("DELETE FROM KeyValue WHERE key = ?", [key]);
  db.run("INSERT INTO KeyValue VALUES (?, ?)", [key, value]);
  msg.channel.send("Success!");
}

function get(msg, argument) {
  var key = argument.trim().toLowerCase();
  if (key.length == 0) {
    msg.channel.send("Empty key not permitted.");
    return;
  }
  db.get("SELECT * FROM KeyValue WHERE key = ?", [key], (err, val) => {
    if (val) {
      msg.channel.send(argument.trim() + " = " + val.value.trim());
    } else {
      msg.channel.send("No value found for key " + argument.trim());
    }
  });
}

function brrify(msg, argument) {
  if (argument.length == 0) {
    msg.channel.send("HelpfulBot go brr.");
    msg.delete({timeout: 1000});
    return;
  }
  var output = "";
  for (var i = 0; i < argument.length; i++) {
    if (i%2==1) {
      output += argument.charAt(i).toUpperCase();
    } else {
      output += argument.charAt(i).toLowerCase();
    }
  }
  msg.channel.send(output);
  msg.delete({timeout: 1000});
}