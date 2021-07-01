// Load discord.js-style Premium Game Commands from ./game/premium/*.js
//FIXME: Obsolete!

const fs = require('fs');

const Discord = require('discord.js')

module.exports = (client, Discord) => {
    const premium_files = fs.readdirSync('./game/premium').filter(file => file.endsWith('.js'));

    for (const file of premium_files) {
        const command = require(`../game/premium/${file}`);

        // if(!message.member.roleId.cache.some(r=>["833802915461988466"].includes(r.id)) ) return message.channel.send('you must be a premium member!');

        if (command.name) {
            client.commands.set(command.name, command);
        } else {
            continue;
        }
    }
}
