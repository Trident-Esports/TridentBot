const Discord = require('discord.js'); // Base Discord module
const { MoodyClient, Handler } = require('a-djs-handler');  // Base Moody module

const client = new MoodyClient({
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
});  // Discord Client object

const mongoose = require('mongoose'); // Mongoose

const Levels = require('discord-xp') // Discord Game XP

const {
    MessageEmbed
} = require("discord.js")  // Discord Embeds

const http = require('http');
//Login Tokens
const fs = require('fs');
SENSITIVE = JSON.parse(fs.readFileSync("SENSITIVE.json", "utf8"));

const UsedCommand = new Set();

const prefix = '.' // Default prefix

Levels.setURL(SENSITIVE.client.mongoDB);
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

// Load Handlers
[
    'command_handler',
    'event_handler',
    'game_handler',
    'premium_handler',
    'rosters_handler'
].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

// Connect to DB
mongoose.connect(
        SENSITIVE.client.mongoDB,
        {
            useNewURLParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
    .then(() => {
        console.log("Connected to the Database!");
    })
    .catch((err) => {
        console.log(err);
    });
// /mongoose

// Message Channels
const channelIDs = JSON.parse(fs.readFileSync("dbs/channels.json", "utf8"))

// User joins Server (Guild)
client.on('guildMemberAdd', (member, Discord) => {
    let ROLES = JSON.parse(fs.readFileSync("dbs/roles.json", "utf8"))
    // Add Minion Role
    let welcomeRole = ROLES.member;
    welcomeRole = member.guild.roles.cache.find(role => role.name === welcomeRole);
    if (welcomeRole !== null) {
        member.roles.add(welcomeRole);
    }
    // console.log(member) // If You Want The User Info in Console Who Joined Server Then You Can Add This Line. // Optional

    console.log("---")
    console.log("---MEMBER JOIN->>")
    console.log("Member:",`${member.user.username}#${member.user.discriminator} (ID:${member.user.id})`)
    console.log("Guild:",`${member.guild.name} (ID:${member.guild.id})`)
    console.log("Member Role?",welcomeRole !== null,`(Str:${ROLES.member})`)
    console.log("Have Channel IDs?",member.guild.id in channelIDs)

    if (!(member.guild.id in channelIDs)) {
        return
    }

    const channel = member.guild.channels.cache.get(channelIDs[member.guild.id].welcome)
    let thumbnail = "https://cdn.discordapp.com/icons/788021898146742292/a_20e3a201ee809143ac5accdf97abe607.gif"
    let footer = {
        "image": "https://cdn.discordapp.com/icons/788021898146742292/a_20e3a201ee809143ac5accdf97abe607.gif",
        "msg": "This bot was Created by Noongar1800#1800"
    }
    try {
        let rules = [
            `Welcome <@${member.user.id}> to **${member.guild.name}**.`,
            "**Are you ready to become a Super Villain?**",
            "",
            `Please Read ${member.guild.channels.cache.get(channelIDs[member.guild.id].rules).toString()}.`,
            "",
            `Also to access the server channels, please go to ${member.guild.channels.cache.get(channelIDs[member.guild.id].roles).toString()}.`
        ]
        const embed = new MessageEmbed()
            .setTitle(`Welcome To ${member.guild.name}`)
            .setThumbnail(thumbnail)
            .setDescription(rules.join("\n"))
            .setFooter(footer["msg"], footer["image"])
            .setColor('RANDOM')

        return channel.send(embed);
    }
    catch (err) {
       throw (err);
    }
});

client.on('guildMemberRemove', (member) => {
    console.log("---")
    console.log("<<-MEMBER LEAVE---")
    console.log("Member:",`${member.user.username}#${member.user.discriminator} (ID:${member.user.id})`)
    console.log("Guild:",`${member.guild.name} (ID:${member.guild.id})`)
    console.log("Have Channel IDs?",member.guild.id in channelIDs)

    if (!(member.guild.id in channelIDs)) {
        return
    }

    // You Can Do The Same For Leave Message
    const leavechannelId = channelIDs[member.guild.id].welcome //Channel You Want to Send The Leave Message
    const leavemessage = `<@${member.id}> **Has just become a Hero.**`

    const channel1 = member.guild.channels.cache.get(leavechannelId)
    return channel1.send(leavemessage);
});

client.on('message', message => {
    for (let check of [
      "hello",
      "hi",
      "hey"
    ]) {
        if (message.content.toLowerCase() === check) {
            if (message.author.bot) return;
                else message.channel.send(`Hello there ${message.author}!`);
        }
    }
});

client.on('message', message => {

    let blacklist = {
        guildIDs: [
            "788021898146742292"  // Villains Esports
        ]
    }

    if (message.content.toLowerCase().includes('lol'))
        if (message.author.bot || message.guild.id === '788021898146742292') return;
        else message.channel.send('https://i.kym-cdn.com/photos/images/newsfeed/002/052/362/aae.gif');
});

console.log("---")
const handler = new Handler(client, {
    prefix: prefix,
    token: SENSITIVE.client.login,
    commandsPath: __dirname + "/moody/commands",
    owners: [
        532192409757679618, // Noongar
        263968998645956608, // Mike
        692180465242603591  // Prime
    ]
});
(async () => {
    await handler.start();
})();

client.login(SENSITIVE.client.login);
