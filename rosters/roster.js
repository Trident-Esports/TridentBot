const dasu = require('dasu');
const { MessageEmbed } = require("discord.js");

let defaults = require("dbs/defaults.json")
let profile = ""
profile = "staff/casters"
profile = require("dbs/" + profile + ".json")

console.log(profile)

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
            .setFooter(defaults.footer.msg, defaults.footer.img)
            .setTimestamp();

        for(let group in profile.members) {
            let userSTR = "";
            for(let user in group.users) {
                userSTR += "[" + user + "]"; // + "(" + socials[user] + ")";
                userSTR += "\n";
            }
            newEmbed.addField(group.title,userSTR,false);
        }

        message.channel.send(newEmbed);
    }
}
