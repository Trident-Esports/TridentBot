const profileModel = require('../../models/profileSchema');     // Profile
const inventoryModel = require('../../models/inventorySchema'); // Inventory
const cooldownsModel = require('../../models/cooldownsSchema'); // Cooldowns
const healthModel = require('../../models/healthSchema');       // Health
const XPBoostModel = require('../../models/xpboostSchema');     // XP Boost

const { MessageEmbed } = require('discord.js'); // Discord Embeds

const cooldowns = new Map();

module.exports = async (Discord, client, message) => {

    const prefix = '.'  // Default Prefix

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

    if (message.content == prefix) return message.channel.send("Please send a proper command");
    if (!message.content.startsWith(prefix)) return;

    let profileData;

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

        let footer = {
          "image": "https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg",
          "msg": "This bot was Created by Noongar1800#1800"
        }

        GameProfileEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`**WELCOME**`)
            .addField(
                `Welcome to VillainsBot ${message.author.username}.`,
                [
                    "To start your journey, please use _.BEG_.",
                    "To check your profile, use _.PROFILE_.",
                    "",
                    "For more information, use _.HELP_."
                ].join("\n"),
                true
            )
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        message.channel.send(GameProfileEmbed)
    }
    let healthData;

    healthData = await healthModel.findOne({ userID: message.author.id });
    if (!healthData) {
        let health = await healthModel.create({
            userID: message.author.id,
            health: 100
        });
        health.save();
    }
    let inventoryData;

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

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if (command?.name) {
        if (!cooldowns.has(command.name)) {
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
        console.log("No name found for command (" + cmd + ")!")
        console.log(command)
        return
    }

    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
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

    if (command) {

        command.execute(message, args, cmd, client, Discord, profileData);
    }
}