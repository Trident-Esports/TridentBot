// Load discord.js-style Events from ./events/*.js

const fs = require('fs');
const Discord = require('discord.js');

module.exports = (client, Discord) => {
    const load_dir = (dirs) => {
        // Get list of files
        if (fs.existsSync(`./events/${dirs}`)) {
            const event_files = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'));

            // Cycle through files
            for (const file of event_files) {
                // Load into memory
                const event = require(`../events/${dirs}/${file}`);
                // Get Event name from filename
                const event_name = file.split('.')[0];
                // Register Event
                client.on(event_name, event.bind(null, Discord, client));
            }
        }
    }

    ['guild'].forEach(e => load_dir(e));
}
