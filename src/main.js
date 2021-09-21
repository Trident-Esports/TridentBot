//@ts-check

const { Client, Intents, Collection } = require('discord.js'); // Base Discord module
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
    console.log("CommandoClient: Create")
    //FIXME: Get proper Intents and such sent
    const cClient = new Commando.Client(
        {
            owner: [
                "263968998645956608", // Mike
                "532192409757679618", // PokerFace
                "692180465242603591", // Prime
                "828317713256415252", // TridentBot
                "884000283838013480"  // API
            ],
            invite: "http://discord.gg/invite/KKYdRbZcPT",
            commandPrefix: prefix
        }
    )

    // Connect to MongoDB
    const mongoConnect = require('./mongo/commands/connect.js')

    // Commando Groups
    console.log("---")
    console.log("Commando-style Loaders:")
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
    cClient.registry.registerGroups(commandGroups)
    console.log("Registered Groups.")

    // Default Data Types
    cClient.registry.registerDefaultTypes()
    console.log("Registered Default Types.")

    // Default Groups
    cClient.registry.registerDefaultGroups()
    console.log("Registered Default Groups.")

    // Default Commands
    cClient.registry.registerDefaultCommands(
        {
            help: false,
            ping: false,
            eval: false
        }
    )
    console.log("Registered Default Commands.")

    // Load discord.js-style Handlers
    console.log("---");
    console.log("D.JS-style Loaders:");
    [
        // 'event_handler',
        // 'game_handler',
        'mongo_handler',
        'rosters_handler'
    ].forEach(handler => {
        require(`./handlers/${handler}`)(cClient);
    })

    // Custom Commands
    let fullDir = ""
    fullDir = path.join(__dirname, "moody/commands")
    cClient.registry.registerCommandsIn(fullDir)
    console.log(`Registered Commands.`)

    // Custom Events
    for(const cat of ["client", "guild"]) {
        if(fs.existsSync(`./src/moody/events/${cat}`)) {
            const files = fs.readdirSync(`./src/moody/events/${cat}`).filter(file => file.endsWith(".js"))
            for(const file of files) {
                let eventName = file.replace(".js","")
                // Client
                if(["ready"].includes(eventName)) {
                    //@ts-ignore
                    cClient.on(eventName, async () => {
                        const eventClass = require(`./moody/events/${cat}/${file}`)
                        const eventObj = new eventClass()
                        await eventObj.run(cClient)
                    })
                } else if(["messageReactionAdd","messageReactionRemove"].includes(eventName)) {
                    //@ts-ignore
                    cClient.on(eventName, async (reaction, user) => {
                        const eventClass = require(`./moody/events/${cat}/${file}`)
                        const eventObj = new eventClass()
                        await eventObj.run(cClient, reaction, user)
                    })

                // Guild
                } else if(["guildMemberAdd","guildMemberRemove","message"].includes(eventName)) {
                    //@ts-ignore
                    cClient.on(eventName, async (item) => {
                        const eventClass = require(`./moody/events/${cat}/${file}`)
                        const eventObj = new eventClass()
                        await eventObj.run(cClient, item)
                    })
                }
            }
        }
        console.log(`Registered ${cat.charAt(0).toUpperCase() + cat.slice(1)} Events.`)
    }

    // Log In
    console.log("---")
    console.log("CommandoClient: Logged in.")
    await cClient.login(process.env.client_login)

    // Register commandError Event
    cClient.on("commandError", (cmd, err, msg, s, b) => {
        console.log(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
})();
