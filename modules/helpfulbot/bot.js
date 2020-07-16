// Where the app begins

// Create the Web Interface
const express = require("express");
const app = express();
app.use(express.static("public"));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const http = require('http');

// app.get("/", (request, response) => {
//   console.log(Date.now() + " Ping Received");
//   response.sendStatus(200);
// });

// // init sqlite db
// const fetch = require("node-fetch");
// const dbFile = "./.data/sqlite.db";
// const fs = require("fs");
// const exists = fs.existsSync(dbFile);
// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database(dbFile);
// // database
// db.serialize(() => {
//   if (!exists) {
//     db.run(
//       "CREATE TABLE KeyValue (key TEXT, value TEXT)"
//     );
//     console.log("New table KeyValue created!");
//   } else {
//     console.log('Database "KeyValue" ready to go!');
//     db.each("SELECT * from KeyValue", (err, row) => {
//       if (err) {
//         console.log("dB retrieval error");
//         console.log(err);
//       }
//       if (row) {
//         // console.log(`Retrieved: ${row.key} = ${row.value}`);
//       }
//     });
//   }
// });
// app.get("/getTable", (request, response) => {
//   db.all("SELECT * from KeyValue", (err, rows) => {
//     response.send(JSON.stringify(rows));
//   });
// });

// // endpoint to remove a single value from the database
// app.post("/removePair", (request, response) => {
//   db.run("DELETE FROM KeyValue WHERE key=\""+request.body.key+"\"", error => {
//     if (error) {
//       console.log(error);
//       response.send({ message: "error!" });
//     } else {
//       response.send({ message: "success" });
//     }
//   });
// });

// // endpoint to add a key-value pair to the database
// app.post("/addPair", (request, response) => {
//   const cleansedKey = cleanseString(request.body.key);
//   const cleansedVal = cleanseString(request.body.value);
//   db.run("INSERT INTO KeyValue VALUES (\"" + cleansedKey + "\", \"" + cleansedVal + "\")", error => {
//     if (error) {
//       console.log(error);
//       response.send({ message: "error!" });
//     } else {
//       response.send({ message: "success" });
//     }
//   });
// });

// // endpoint to clear dreams from the database
// app.get("/clearTable", (request, response) => {
//   db.each(
//     "SELECT * from KeyValue",
//     (err, row) => {
//       console.log("row", row);
//       if (row) {
//         db.run(`DELETE FROM KeyValue WHERE key=?`, row.key, error => {
//           console.log(`deleted data at ${row.key}`);
//         });
//       }
//     },
//     err => {
//       if (err) {
//         response.send({ message: "error!" });
//       } else {
//         response.send({ message: "success" });
//       }
//     }
//   );
// });

// // helper function that prevents html/css/script malice
// const cleanseString = function(string) {
//   return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
// };

// function forEachDataPair(action) {
//   fetch("https://helpful-bot-0355.glitch.me/getTable", {})
//   .then(res => res.json())
//   .then(response => {
//     response.forEach(row => {
//       action(row);
//     });
//   });
// }

// function storeKeyAndValue(key, value) {
//   const data = {
//     key: key,
//     value: value
//   };
//   storeKvPair(data);
// }

// function storeKvPair(data) {
//   fetch("https://helpful-bot-0355.glitch.me/addPair", {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: { "Content-Type": "application/json" }
//   });
//   dataMap[data.key] = data.value;
// }

// function clearTable() {
//   fetch("https://helpful-bot-0355.glitch.me/clearTable", {})
//     .then(res => res.json())
//     .then(response => {
//       console.log("cleared table");
//     });
//   dataMap = new Map();
// }

// function removeKey(key) {
//   const data = {
//     key: key
//   };
//   fetch("https://helpful-bot-0355.glitch.me/removePair", {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: { "Content-Type": "application/json" }
//   });
//   dataMap.delete(key);
// }

// var dataMap = new Map();
// forEachDataPair(data => {dataMap[data.key] = data.value;});

// *AHEM* (clears throat)
// Launch the Discord Bot

const prefix = 'h?'
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('h?commands', { type: 'LISTENING' });
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
// registerCommand('put', put, 'Puts a key-value to the database');
// registerCommand('get', get, 'Gets a key-value from the database');
registerCommand('periodics', periodics, 'Displays the registered periodic functions');

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

// function put(msg, argument) {
//   var tokens = argument.split("=");
//   if (tokens.length != 2) {
//     msg.reply("Enter a key and value separated by an equals sign.");
//     return;
//   }
//   if (tokens[0].trim().toLowerCase().length == 0) {
//     msg.channel.send("Empty key not permitted.");
//   } else {
//     storeKeyAndValue(tokens[0].trim().toLowerCase(), tokens[1].trim());
//   }
// }

// function get(msg, argument) {
//   var key = argument.trim().toLowerCase();
//   if (key.length == 0) {
//     msg.channel.send("Empty key not permitted.");
//     return;
//   }
//   if (dataMap[key]) {
//     msg.channel.send(argument.trim() + " = " + dataMap[key].trim());
//   } else {
//     msg.channel.send("No value found for key " + argument.trim());
//   }
// }