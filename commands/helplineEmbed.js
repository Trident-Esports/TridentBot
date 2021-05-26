const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'helpline',
    aliases: ['hl'],
    description: "This is a help embed",
    execute(message, args, cmd, client, Discord) {
     try{   const newEmbed = new MessageEmbed()
            .setColor('#23dd17')
            .setTitle('***HelpLine***')
            .setURL('https://discord.gg/KKYdRbZcPT')
            .setDescription(' This is a list of the commands and help for VillainsBot')
            .addFields( {name: '**General Help**', value: 'This is a ticket for general discord help.\n `Command = .ticket`'},
            {name:'**Queens Babies**', value: "This is a ticket for help with anything womens related that maybe guys might not understand or something abit personal that our selected women's helpers can help with.\n `Command = .qbticket`"},
            {name: '**The Boys**', value: 'Here at Villains we understand that sometimes guys have problems too that they might not want to confront with alone. If you would like someone to talk to then feel free to create a ticket.\n `Command = .tbticket`'})
            .setThumbnail('https://d1fdloi71mui9q.cloudfront.net/al4c957kR4eQffCsIv3o_N5PQkEjiGc43pxbU')
            .setImage('https://multiculturalmarriage.files.wordpress.com/2013/07/help-button-hi.png')
            .setFooter('This bot was Created by Noongar1800#1800', 'https://cdn.discordapp.com/attachments/828595312981573682/831291472698671167/Screenshot_20210310-095826_Snapchat.jpg')
            .setTimestamp();

        message.channel.send(newEmbed);
     }
     catch(err){
     console.log(err)
    }
    }
}