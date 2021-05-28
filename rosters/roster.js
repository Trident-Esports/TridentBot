const dasu = require('dasu');
const { MessageEmbed } = require("discord.js");

const fs = require('fs');

let defaults = JSON.parse(fs.readFileSync("rosters/dbs/defaults.json", "utf8"))
let profile = ""
profile = "staff/casters" // Hard-code to .cr for now
                          // Team is gonna have to be teams/<gameID>/<genericTeam>.json
profile = JSON.parse(fs.readFileSync("rosters/dbs/" + profile + ".json", "utf8"))

let stripe = profile["stripe"]
switch(stripe) {
  default:
    stripe = "#B2EE17";
    break;
}
profile["stripe"] = stripe

module.exports = {
    name: profile.title,
    aliases: profile.aliases,
    permissions: [],
    description: profile.title,
    async execute(message, client, Discord) {

        var newEmbed = new MessageEmbed()
            .setColor(profile.stripe)
            .setTitle("***" + profile.title + "***")
            .setURL(profile.url)
            // .setDescription()
            .setThumbnail(defaults.thumbnail)
            .setFooter(defaults.footer.msg, defaults.footer.image)
            .setTimestamp();

        for(let [groupName, groupAttrs] of Object.entries(profile.members)) {
            let userSTR = "";
            for(let user of groupAttrs.users) {
                // userSTR += "[" + user + "]" + "(" + socials[user] + ")";
                userSTR += "[" + user + "](http://example.com)";
                userSTR += "\n";
            }
            newEmbed.addField(groupAttrs.title,userSTR,false);
        }

        message.channel.send(newEmbed);
    }
}
