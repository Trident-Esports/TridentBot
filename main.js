const Discord = require('discord.js'); // Base Discord module
const { MoodyClient, Handler } = require('a-djs-handler');  // Base Moody module

const client = new MoodyClient({
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
});  // Discord Client object

const mongoose = require('mongoose'); // Mongoose

const Levels = require('discord-xp') // Discord Game XP

//Login Tokens
const fs = require('fs');

let SENSITIVE = null
try {
    SENSITIVE = JSON.parse(fs.readFileSync("./SENSITIVE.json", "utf8"));
} catch (err) {
    console.log("Main: SENSITIVE manifest not found!")
    process.exit(1)
}

// Bail if we fail to get secrets file
if (!SENSITIVE) {
    console.log("Failed to get secrets file.")
    return
}

const DEFAULTS = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"));

// Bail if we fail to get server profile information
if (!DEFAULTS) {
    console.log("Failed to get server profile information.")
    return
}

const prefix = DEFAULTS.prefix // Default prefix
// Bail if we fail to get command prefix
if (!prefix) {
    console.log("Failed to get command prefix.")
    return
}

try {
    Levels.setURL(SENSITIVE.client.mongoDB);
} catch {
    console.log("MongoDB: Failed to connect!")
    process.exit(1)
}

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

// Load Handlers
[
    'event_handler',
    'game_handler',
    'rosters_handler'
].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

// Connect to DB
mongoose.connect(
        SENSITIVE.client.mongoDB,
        {
            useNewURLParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
    .then(() => {
        console.log("MongoDB: Connected!");
    })
    .catch((err) => {
        console.log(err);
    });
// /mongoose

console.log("---")
const handler = new Handler(client, {
    prefix: prefix,
    token: SENSITIVE.client.login,
    commandsPath: __dirname + "/moody/commands",
    eventsPath: __dirname + "/moody/events",
    owners: [
        532192409757679618, // Noongar
        263968998645956608, // Mike
        692180465242603591  // Prime
    ]
});
(async () => {
    await handler.start();
})();
