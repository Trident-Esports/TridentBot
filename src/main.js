//@ts-check

const { Intents, Collection } = require('discord.js'); // Base Discord module
const { MoodyClient, Handler } = require('a-djs-handler');  // Base Moody module
const BotActivityCommand = require('./moody/commands/mod/botactivity'); // Bot Activity module
const replace = require('replace-in-file')
const Levels = require('discord-xp') // Discord Game XP
const Ascii = require('ascii-table')
const fs = require('fs');
const keep_alive = require("./httpd.js")
require('dotenv').config()

let guildEventsPath = "./src/moody/events/guild"
if (fs.existsSync(guildEventsPath + "/message.js")) {
    if (fs.existsSync(guildEventsPath + "/messageCreate.js")) {
        fs.unlinkSync(guildEventsPath + "/messageCreate.js")
    }
    fs.copyFileSync(
        guildEventsPath + "/message.js",
        guildEventsPath + "/messageCreate.js"
    )
    let options = {
        files: guildEventsPath + "/messageCreate.js",
        from: "MessageEvent",
        to: "MessageCreateEvent"
    }
    replace.sync(options)
    options.from = "'message'"
    options.to = "'messageCreate'"
    replace.sync(options)
}

const DEFAULTS = JSON.parse(fs.readFileSync("./src/dbs/defaults.json", "utf8"));

// Bail if we fail to get server profile information
if (!DEFAULTS) {
    console.log("🔴Failed to get server profile information.")
    process.exit(1)
}

const prefix = DEFAULTS.prefix // Default prefix
// Bail if we fail to get command prefix
if (!prefix) {
    console.log("🔴Failed to get command prefix.")
    process.exit(1)
}

try {
    // @ts-ignore
    Levels.setURL(process.env.client_mongoDB);
} catch {
    console.log("🔴MongoDB Levels: Failed to connect!")
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
    const Table = new Ascii("D*JS-style Commands", {});
    [
        // 'event_handler',
        'game_handler',
        'mongo_handler',
        'rosters_handler'
    ].forEach(handler => {
        Table.addRow(`🟢${handler.slice(0,1).toUpperCase()}${handler.slice(1,handler.indexOf("_"))} Commands`)
        require(`./handlers/${handler}`)(client);
    })
    console.log(Table.toString())

    // Connect to MongoDB
    console.log("---");
    // @ts-ignore
    await client.mongoConnect();

    console.log("---");
    console.log("a-djs-style");
    // Load a-djs-style Handlers
    const handler = new Handler(client, {
        prefix: prefix,
        // @ts-ignore
        token: process.env.client_login_production,
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
    // @ts-ignore
    await ba.run(client, null, [], null, "")
})();
