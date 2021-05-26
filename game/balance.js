module.exports = {
    name: 'balance',
    aliases: ['bal', 'coins'],
    permissions: [],
    description: "Checks the Users Balance",
    execute(message, args, cmd, client, Discord, profileData){
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#23dd17')
            .setTitle('***Balance***')
            .setURL('https://discord.gg/KKYdRbZcPT')
            .setDescription(`This is ${message.author}'s Balance`)
            .addField(` 💰 ${profileData.gold.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Gold', true)
            .addField(` 🏦 ${profileData.bank.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Bank', true)
            .addField(` 🐵 ${profileData.minions}`, 'Minions', true)
            .setThumbnail(message.author.avatarURL({ dynamic: true, format: 'png'}))
            .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
            .setTimestamp();

        message.channel.send(newEmbed);
    }
};