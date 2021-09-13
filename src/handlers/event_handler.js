// Load discord.js-style Events from ./events/*.js

const fs = require('fs');

module.exports = (client, Discord) => {
    const load_dir = (dirs) => {
        // Get list of files
        if (fs.existsSync(`./src/events/${dirs}`)) {
            const event_files = fs.readdirSync(`./src/events/${dirs}`).filter(file => file.endsWith('.js'));

            // Cycle through files
            for (const file of event_files) {
                // Load into memory
                const event = require(`../events/${dirs}/${file}`);
                // Get Event name from filename
                const event_name = file.split('.')[0];
                // Register Event
                client.on(event_name, event.bind(null, Discord, client));
            }
            console.log("Registered " + dirs.substr(0,1).toUpperCase() + dirs.slice(1) + " Events.")
        }
    }

    ['guild'].forEach(e => load_dir(e));
}
