// Load discord.js-style Commands from ./commands/*.js

const fs = require('fs');
const Discord = require('discord.js')

module.exports = (client, Discord) => {
    // Get list of files
    const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

    // Cycle through files
    for (const file of command_files) {
        // Load command into memory
        const command = require(`../commands/${file}`);

        // If we've got a Command name
        if (command.name) {
            // Add it
            client.commands.set(command.name, command);
        } else {
            // Else, skip it
            continue;
        }
    }
}
