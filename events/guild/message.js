const profileModel = require('../../models/profileSchema');     // Profile
const inventoryModel = require('../../models/inventorySchema'); // Inventory
const cooldownsModel = require('../../models/cooldownsSchema'); // Cooldowns
const healthModel = require('../../models/healthSchema');       // Health
const XPBoostModel = require('../../models/xpboostSchema');     // XP Boost

const { MessageEmbed } = require('discord.js'); // Discord Embeds
const VillainsEmbed = require('../../moody/classes/vembed.class'); // Villains Embed

const fs = require('fs'); // File System

const cooldowns = new Map();

module.exports = async (Discord, client, message) => {

    const DEFAULTS = JSON.parse(fs.readFileSync("./dbs/defaults.json", "utf8"))
    const prefix = DEFAULTS.prefix; // Default Prefix

    //FIXME: Obsolete?
    if (message.author.bot) {
        let send = false;
        for(let check of ["complete","incomplete","next"]) {
            let re = new RegExp("(\\.)(\\S*)(\\s)(" + check + ")");
            if(re.test(message.content) !== false) {
                send = true;
            }
        }
        if(!send) {
            return;
        }
    }

    // If it's just the prefix, return error
    if (message.content == prefix) {
        let props = {
            caption: { text: "VillainsBot" },
            title: { text: "Error" },
            description: "Please send a proper command."
        }
        let embed = new VillainsEmbed(props);
        message.channel.send(embed)
        return;
    }

    // If it doesn't start with our prefix, return
    if (!message.content.startsWith(prefix)) return;

    let profileData;

    /*
    FIXME: Is this just a sanity check? It should use the same logic as ./events/guild/guildMemberAdd.js
     These defaults:
      Gold: 1000
      Rank: Beginner
    */
    profileData = await profileModel.findOne({ userID: message.author.id });
    if (!profileData) {
        let profile = await profileModel.create({
            userID: message.author.id,
            gold: 1000,
            bank: 0,
            minions: 0,
            title: 'Beginner'
        });
        profile.save();

        let props = {
            caption: { text: "VillainsBot" },
            title: { text: "**WELCOME**" },
            fields: [
                {
                    name: `Welcome to VillainsBot, <@${message.author.id}>!`,
                    value: [
                        "To start your journey, use `.beg`",
                        "To check your profile, use `.profile`",
                        "",
                        "For more information, use `.help`"
                    ].join("\n")
                }
            ]
        }

        let embed = new VillainsEmbed(props)
        message.channel.send(embed)
    }

    let healthData;

    /*
    FIXME: Is this just a sanity check? It should use the same logic as ./events/guild/guildMemberAdd.js
     These defaults:
      Health: 100
    */
    healthData = await healthModel.findOne({ userID: message.author.id });
    if (!healthData) {
        let health = await healthModel.create({
            userID: message.author.id,
            health: 100
        });
        health.save();
    }
    let inventoryData;

    /*
    FIXME: Is this just a sanity check? It should use the same logic as ./events/guild/guildMemberAdd.js
     These defaults:
      Power Potion (💉; Health Restore): 1
    */
    inventoryData = await inventoryModel.findOne({ userID: message.author.id })
    if (!inventoryData) {
        let inventory = await inventoryModel.create({
            userID: message.author.id,
            items: [],
            consumables: [],
            powers: ['💉']
        });
        inventory.save();
    }

    let cooldownsData;

    cooldownsData = await cooldownsModel.findOne({ userID: message.author.id })
    if (!cooldownsData) {
        let cooldowns = await cooldownsModel.create({
            userID: message.author.id,
            usedcooldowns: []
        });
        cooldowns.save();
    }
    let XPBoostData;

    XPBoostData = await XPBoostModel.findOne({ userID: message.author.id });
    if (!XPBoostData) {
        let XPBoost = await XPBoostModel.create({
            userID: message.author.id,
            xpboost: 1
        });
        XPBoost.save();
    }

    // Get Args
    const args = message.content.slice(prefix.length).split(/ +/);

    // Get Command
    const cmd = args.shift().toLowerCase();

    // Search for Command
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    // If we've got a Command
    if (command?.name) {
        // If we're not on Cooldown
        if (!cooldowns.has(command.name)) {
            // Set a Cooldown
            cooldowns.set(command.name, new Discord.Collection());
            await cooldownsModel.findOneAndUpdate(
                {
                    userID: message.author.id,
                },
                {
                    $push: {
                        usedcooldowns: command.name,
                    },
                });
        }
    } else {
        // Didn't find a name for submitted Command
        console.log(`No name found for command! '${cmd}' given`)
        console.log(command)
        return
    }

    // Get current time
    const current_time = Date.now();
    // Get CDs for this command
    const time_stamps = cooldowns.get(command.name);
    // Get CD amount for this command
    const cooldown_amount = (command.cooldown) * 1000;

    //If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
    if (time_stamps.has(message.author.id)) {
        const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

        if (current_time === expiration_time) {
            await cooldownsModel.findOneAndUpdate(
                {
                    userID: message.author.id,
                },
                {
                    $pull: {
                        usedcooldowns: command.name,
                    },
                });
        }

        if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000;

            var Days = Math.floor(time_left / 86400); // Find the Days
            var Hours = Math.floor(time_left / 3600) % 24; //Finds the Hours
            var Minutes = Math.floor(time_left / 60) % 60; //Finds the minutes
            var Seconds = Math.floor(time_left % 60); //Finds the remaining seconds.

            if (!Days && !Hours && !Minutes) return message.reply(`Please wait ${Seconds} more seconds before using **${command.name}.**`);
            // if (!Hours) return message.reply(`Please wait ${Minutes} more minutes and ${Seconds} more seconds before using **${command.name}**.`);
            if (!Hours && !Days)
                return message.reply(`Please wait ${Minutes}m ${Seconds}s before using **${command.name}**.`);

            else (!Days)
            return message.reply(`Please wait ${Hours}h ${Minutes}m ${Seconds}s before using **${command.name}**.`);
        }
    }

    //If the author's id is not in time_stamps then add them with the current time.
    time_stamps.set(message.author.id, current_time);
    //Delete the user's id once the cooldown is over.
    setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

    // If we've found a Command and we're ready to use it
    if (command) {
        if (typeof command.execute === "function") {
            // If it's a discord.js-style func, run it
            command.execute(message, args, cmd, client, Discord, profileData);
        }
    }
}
