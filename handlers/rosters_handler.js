const fs = require('fs');

const Discord = require('discord.js')

module.exports = (client, Discord) => {
    const rosters_files = fs.readdirSync('./rosters').filter(file => file.endsWith('.js'));

    for (const file of rosters_files) {
        const command = require(`../rosters/${file}`);

        // if(!message.member.roleId.cache.some(r=>["833802915461988466"].includes(r.id)) ) return message.channel.send('you must be a premium member!');

        if (command.name) {
            client.commands.set(command.name, command);
        } else {
            continue;
        }
    }
}