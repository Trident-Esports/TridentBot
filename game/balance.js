module.exports = {
    name: 'balance',
    aliases: ['bal', 'coins'],
    permissions: [],
    description: "Checks the Users Balance",
    execute(message, args, cmd, client, Discord, profileData){
        let props = {
            "embedColor": "#B2EE17",
            "title": "***Balance***",
            "url": "https://discord.com/KKYdRbZcPT"
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }
        const newEmbed = new Discord.MessageEmbed()
            .setColor(props["embedColor"])
            .setTitle(props["title"])
            .setURL(props["url"])
            .setDescription(`This is ${message.author}'s Balance`)
            .addField(` 💰 ${profileData.gold.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Gold', true)
            .addField(` 🏦 ${profileData.bank.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, 'Bank', true)
            .addField(` 🐵 ${profileData.minions}`, 'Minions', true)
            .setThumbnail(message.author.avatarURL({ dynamic: true, format: 'png'}))
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        message.channel.send(newEmbed);
    }
};
