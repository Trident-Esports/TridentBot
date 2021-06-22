const Discord = require('discord.js');  // Base Discord module

const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });  // Discord Client object

const mongoose = require('mongoose'); // Mongoose

const Levels = require('discord-xp')  // Discord Game XP

const { MessageEmbed } = require("discord.js")  // Discord Embeds

require('discord-buttons')(client); // Discord Buttons
const http = require('http');
//Login Tokens
const fs = require('fs');
SENSITIVE = JSON.parse(fs.readFileSync("SENSITIVE.json", "utf8"));

const UsedCommand = new Set();

const prefix = '.'  // Default prefix

Levels.setURL(SENSITIVE.client.mongoDB);
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

// Load Handlers
[
    'command_handler',
    'event_handler',
    'game_handler',
    'premium_handler',
    'testing_handler',
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
const channelIDs = {
    "welcome": "795820413241786398",
    "rules": "788576321231388704",
    "roles": "795824892863053895"
}

// User joins Server (Guild)
client.on('guildMemberAdd', (member, Discord) => {
    // Add Minion Role
    let welcomeRole = "Minions";
    welcomeRole = member.guild.roles.cache.find(role => role.name === welcomeRole);
    member.roles.add(welcomeRole);
    console.log(member) // If You Want The User Info in Console Who Joined Server Then You Can Add This Line. // Optional

    const channel = member.guild.channels.cache.get(channelIDs["welcome"])
    let thumbnail = "https://cdn.discordapp.com/icons/788021898146742292/a_20e3a201ee809143ac5accdf97abe607.gif"
    let footer = {
        "image": "https://cdn.discordapp.com/icons/788021898146742292/a_20e3a201ee809143ac5accdf97abe607.gif",
        "msg": "This bot was Created by Noongar1800#1800"
    }
    try {
        const embed = new MessageEmbed()
            .setTitle(`Welcome To ${member.guild.name}`)
            .setThumbnail(thumbnail)
            .setDescription(`Welcome <@${member.user.id}> to **${member.guild.name}**.\n
            **Are you ready to become a Super Villain?**\n\n
            Please Read ${member.guild.channels.cache.get(channelIDs.rules).toString()}.\n\n
            Also to access the server channels, please go to ${member.guild.channels.cache.get(channelIDs.roles).toString()}.`)
            .setFooter(footer["msg"], footer["image"])
            .setColor('RANDOM')

        return channel.send(embed);
    }
    catch(err) {
       throw(err);
    }
});

client.on('guildMemberRemove', (member) => {
    // You Can Do The Same For Leave Message
    const leavechannelId = channelIDs["welcome"] //Channel You Want to Send The Leave Message
    const leavemessage = `<@${member.id}> **Has just become a Hero.**`

    const channel1 = member.guild.channels.cache.get(leavechannelId)
    return channel1.send(leavemessage);
});

client.on('message', message => {
    for(let check of [
      "hello",
      "hi",
      "hey"
    ]) {
        if(message.content.toLowerCase() === check) {
            if(message.author.bot) return;
                else message.channel.send(`Hello there ${message.author}!`);
        }
    }
});

client.on('message', message => {

    if (message.content.toLowerCase().includes('lol'))
    if (message.author.bot || message.guild.id === '788021898146742292') return;
    else message.channel.send('https://i.kym-cdn.com/photos/images/newsfeed/002/052/362/aae.gif');
});

client.on('clickButton', async(button) => {
    if(button.id == 'NextM') {

        button.defer()
        button.channel.send('.vvrs next')
    }
}

);

client.login(SENSITIVE.client.login);
