const fs = require('fs');
let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
const Discord = require('discord.js')

module.exports = (client, Discord) => {
    const game_files = fs.readdirSync('./game').filter(file => file.endsWith('.js'));

    for (const file of game_files) {
        const command = require(`../game/${file}`);
        if (command.name) {
            client.commands.set(command.name, command);
        } else {
            continue;
        }
    }
}