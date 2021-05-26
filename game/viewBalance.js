const profileModel = require('../models/profileSchema');

module.exports = {
    name: 'viewBalance',
    aliases: ['vbal'],
    permissions: ["ADMINISTRATOR"],
    description: "Checks the Users Balance",
    async execute(message, args, cmd, client, Discord){

        // if (message.member.id != "532192409757679618" && message.member.id != "692180465242603591") return message.channel.send(`Sorry only **Noongar1800** and **PrimeWarGamer** can run this command 😔`); //This line will be used later for Premium Only Command
        
        if (!args.length) return message.channel.send("You need to mention a player to view their balance.");

        const target = message.mentions.members.first()
        if (!target) return message.channel.send("That user does not exist");

        const profileData = await profileModel.findOne({ userID: target.id });

        const newEmbed = new Discord.MessageEmbed()
            .setColor('#23dd17')
            .setTitle('***Balance***')
            .setURL('https://discord.gg/KKYdRbZcPT')
            .setDescription(`This is ${target}'s Balance`)
            .addField(` 💰 ${profileData.gold.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Gold', true)
            .addField(` 🏦 ${profileData.bank.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Bank', true)
            .addField(` 🐵 ${profileData.minions}`, 'Minions', true)
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true, format: 'png'}))
            .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
            .setTimestamp();

        message.channel.send(newEmbed);
    }
};