const { SapphireClient } = require('@sapphire/framework');
const Ascii = require('ascii-table');
const chalk = require('chalk');
const fs = require('fs');
require('dotenv').config();

// Bail if we fail to get server profile information
const DEFAULTS = JSON.parse(fs.readFileSync("./src/dbs/defaults.json","utf8"))
if(!DEFAULTS) {
    console.log(chalk.red("🔴Failed to get server profile information."))
    process.exit(1)
}

// Bail if we fail to get command prefix
const prefix = DEFAULTS.prefix // Default prefix
if (!prefix) {
    console.log(chalk.red("🔴Failed to get command prefix."))
    process.exit(1)
}

(async () => {
    const client = new SapphireClient(
        {
            defaultPrefix: prefix,
            // @ts-ignore
            intents: [
                "GUILDS",
                "GUILD_MEMBERS",
                "GUILD_MESSAGES",
                "GUILD_MESSAGE_REACTIONS",
                "DIRECT_MESSAGES",
                "DIRECT_MESSAGE_REACTIONS"
            ]
        }
    )
    client.login(process.env.client_login)
})();
