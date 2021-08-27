const { Client, Intents, Collection } = require('discord.js'); // Base Discord module
const { MoodyClient, Handler } = require('a-djs-handler');  // Base Moody module
require('dotenv').config()

const client = new MoodyClient({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: [ Intents.FLAGS.GUILDS ]
});  // Discord Client object

const mongoose = require('mongoose'); // Mongoose

const Levels = require('discord-xp') // Discord Game XP

//Login Tokens
const fs = require('fs');

let SENSITIVE = null
try {
    SENSITIVE = JSON.parse(fs.readFileSync("./src/SENSITIVE.json", "utf8"));
} catch (err) {
    console.log("Main: SENSITIVE manifest not found!")
    process.exit(1)
}

// Bail if we fail to get secrets file
if (!SENSITIVE) {
    console.log("Failed to get secrets file.")
    return
}

const DEFAULTS = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"));

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

client.commands = new Collection();
client.events = new Collection();

// Load Handlers
[
    'event_handler',
    'game_handler',
    'rosters_handler'
].forEach(handler => {
    require(`./handlers/${handler}`)(client);
})

// Connect to DB
mongoose.connect(
        process.env.client_mongoDB,
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
    token: process.env.client_login,
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
