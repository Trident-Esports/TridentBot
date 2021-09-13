//@ts-check

const { Intents, Collection } = require('discord.js'); // Base Discord module
const { MoodyClient, Handler } = require('a-djs-handler');  // Base Moody module
const BotActivityCommand = require('./moody/commands/mod/botactivity'); // Bot Activity module
const Levels = require('discord-xp') // Discord Game XP
const fs = require('fs');
require('dotenv').config()

const DEFAULTS = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"));

// Bail if we fail to get server profile information
if (!DEFAULTS) {
    console.log("Failed to get server profile information.")
    process.exit(1)
}

const prefix = DEFAULTS.prefix // Default prefix
// Bail if we fail to get command prefix
if (!prefix) {
    console.log("Failed to get command prefix.")
    process.exit(1)
}

try {
    // @ts-ignore
    Levels.setURL(process.env.client_mongoDB);
} catch {
    console.log("MongoDB Levels: Failed to connect!")
    process.exit(1)
}

(async () => {
    // Create Client Object
    const client = new MoodyClient({
        partials: [ "MESSAGE", "CHANNEL", "REACTION" ],
        ws: {
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
            ]
        },
        allowedMentions: {
            parse: [ "users", "roles" ]
        }
    });  // Discord Client object

    // Create a bucket for discord.js-style Commands
    client.commands = new Collection();
    // Create a bucket for discord.js-style Events
    client.events = new Collection();

    // Load discord.js-style Handlers
    console.log("---");
    console.log("D.JS-style");
    [
        'event_handler',
        'game_handler',
        'mongo_handler',
        'rosters_handler'
    ].forEach(handler => {
        require(`./handlers/${handler}`)(client);
    })

    // Connect to MongoDB
    console.log("---");
    // @ts-ignore
    await client.mongoConnect();

    console.log("---");
    console.log("a-djs-style");
    // Load a-djs-style Handlers
    const handler = new Handler(client, {
        prefix: prefix,
        token: process.env.client_login,
        commandsPath: __dirname + "/moody/commands",
        eventsPath: __dirname + "/moody/events",
        owners: [
            "532192409757679618", // PokerFace
            "263968998645956608", // Mike
            "692180465242603591"  // Prime
        ]
    });
    await handler.start();

    // Set Bot Activity Status
    console.log("---");
    let ba = new BotActivityCommand({ null: true })
    await ba.run(client, null, [], null, "")
})();
