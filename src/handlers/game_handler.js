// Load discord.js-style Game Commands from ./game/*.js
//FIXME: cooldowns.js

const fs = require('fs');

module.exports = (client) => {
    // Get list of files
    const game_files = fs.readdirSync('./game').filter(file => file.endsWith('.js'));

    // Cycle through files
    for (const file of game_files) {
        // Load Command into memory
        const command = require(`../game/${file}`);

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
