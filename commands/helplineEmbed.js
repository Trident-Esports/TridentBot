const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'helpline',
    aliases: ['hl'],
    description: "This is a help embed",
    execute(message, args, cmd, client, Discord) {
     try{   
        let props = {
            "embedColor": "#B2EE17",
            "title": "***HelpLine***",
            "url": "https://discord.com/KKYdRbZcPT"
        }
        let footer = {
            "image": "https://cdn.discordapp.com/avatars/532192409757679618/73a8596ec59eaaad46f561b4c684564e.png",
            "msg": "This bot was Created by Noongar1800#1800"
        }

        const newEmbed = new MessageEmbed()
        .setColor(props["embedColor"])
        .setTitle(props["title"])
        .setURL(props["url"])
            .setDescription(' This is a list of the commands and help for VillainsBot')
            .addFields( {name: '**General Help**', value: 'This is a ticket for general discord help.\n `Command = .ticket`'},
            {name:'**Queens Babies**', value: "This is a ticket for help with anything womens related that maybe guys might not understand or something abit personal that our selected women's helpers can help with.\n `Command = .qbticket`"},
            {name: '**The Boys**', value: 'Here at Villains we understand that sometimes guys have problems too that they might not want to confront with alone. If you would like someone to talk to then feel free to create a ticket.\n `Command = .tbticket`'})
            .setThumbnail('https://d1fdloi71mui9q.cloudfront.net/al4c957kR4eQffCsIv3o_N5PQkEjiGc43pxbU')
            .setImage('https://multiculturalmarriage.files.wordpress.com/2013/07/help-button-hi.png')
            .setFooter(footer["msg"], footer["image"])
            .setTimestamp();

        message.channel.send(newEmbed);
     }
     catch(err){
     console.log(err)
    }
    }
}