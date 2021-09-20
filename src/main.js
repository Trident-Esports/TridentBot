//@ts-check

const { Intents, Collection } = require('discord.js'); // Base Discord module
const { MoodyClient, Handler } = require('a-djs-handler');  // Base Moody module
const BotActivityCommand = require('./moody/commands/mod/botactivity'); // Bot Activity module
const Commando = require('discord.js-commando');
const Levels = require('discord-xp') // Discord Game XP
const path = require('path');
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
    console.log("---")
    console.log("MoodyClient: Create")
    // Create Client Object
    const mClient = new MoodyClient({
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

    console.log("MoodyClient: Buckets")
    // Create a bucket for discord.js-style Commands
    mClient.commands = new Collection();
    // Create a bucket for discord.js-style Events
    mClient.events = new Collection();

    console.log("---")
    console.log("CommandoClient: Create")
    const cClient = new Commando.Client(
        {
            owner: "263968998645956608",
            commandPrefix: prefix
        }
    )

    // Load discord.js-style Handlers
    console.log("---");
    console.log("D.JS-style");
    [
        // 'event_handler',
        'game_handler',
        'mongo_handler',
        'rosters_handler'
    ].forEach(handler => {
        require(`./handlers/${handler}`)(mClient);
    })

    // Connect to MongoDB
    console.log("---");
    // @ts-ignore
    await mClient.mongoConnect();

    if(false) {
        console.log("---");
        console.log("a-djs-style");
        // Load a-djs-style Handlers
        const handler = new Handler(mClient, {
            prefix: prefix,
            token: process.env.client_login,
            commandsPath: __dirname + "/images",
            eventsPath: __dirname + "/moody/events",
            owners: [
                "532192409757679618", // PokerFace
                "263968998645956608", // Mike
                "692180465242603591"  // Prime
            ]
        });
        await handler.start();
    }

    console.log("---")
    console.log("Commando-style")
    const commandGroups = [
        [ "admin",        "Administration" ],
        [ "diag",         "Diagnostic" ],
        [ "eastereggs",   "Easter Eggs" ],
        [ "fun",          "Fun" ],
        [ "game",         "Game" ],
        [ "game/premium", "Premium Game" ],
        [ "info",         "Information" ],
        [ "meta",         "Meta" ],
        [ "mod",          "Moderation" ],
        [ "music",        "Music" ],
        [ "smashgg",      "Smash.GG" ],
        [ "ticketsystem", "Ticket System" ]
    ]
    cClient.registry
        .registerGroups(commandGroups)
        .registerDefaults()
    console.log("Registered Groups.")
    console.log("Registered Defaults.")

    let fullDir = path.join(__dirname, "moody/commands")
    console.log(`Registered Commands.`)
    cClient.registry.registerCommandsIn(fullDir)

    console.log("---")
    console.log("CommandoClient: Logged in.")
    await cClient.login(process.env.client_login)

    cClient.on("ready", () => {
        const eReady = require('./moody/events/client/ready')
        const event = new eReady()
        event.run(cClient)
    })
    cClient.on("commandError", (cmd, err, msg, s, b) => {
        console.log(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
    cClient.on("message", (msg) => {
        const eMessage = require('./moody/events/guild/message')
        const event = new eMessage()
        event.run(cClient, msg)
    })

    if(false) {
        // Set Bot Activity Status
        console.log("---");
        let ba = new BotActivityCommand({ null: true })
        await ba.run(new Commando.CommandoMessage(cClient, {}, null), [ "" ])
    }
})();
