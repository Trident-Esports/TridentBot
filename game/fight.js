const {
    MessageEmbed
} = require("discord.js");

const profileModel = require("../models/profileSchema");

const Levels = require('discord-xp');

module.exports = {
    name: "fight",
    aliases: ['battle'],
    permissions: ["SEND_MESSAGES"],
    cooldown: 60 * 60 /** 2*/ , // 2 Hours When Completed
    category: "Battle",
    description: "Choose your player to fight and get bragging rights",

    async execute(message, args, command, client, Discord, profileData) {

        const prefix = '.'

        const randomXP = Math.floor(Math.random() * 300) + 300;

        if (!args.length) {
            this.cooldown = 0
            return message.channel.send('Who you gonna fight?')
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!target && this.cooldown === 0) {
            // this.cooldown = 0;
            return message.channel.send('Bruh, you can\'t fight no one.');
        }

        if (target.id === message.author.id && this.cooldown === 0) {
            // this.cooldown = 0
            return message.channel.send('You cannot fight yourself wtf?!?');
        }

        let props = {
            "botID": "828317713256415252"
        }

        if (target.id === props["botID"] && this.cooldown === 0) {
            this.cooldown = 60 * 5
            return message.channel.send("Now who's the Bot? 🤡\nGo sit in timeout for 5 minutes!");
        }


        const Contestants = [
            message.author.id,
            target.id,
        ];

        let chosenWinner = Contestants.sort(() => Math.random() - Math.random()).slice(0, 1);
        console.log(chosenWinner)

        const WinningsNUMBER = Math.floor(Math.random() * 1500) + 1200;
        console.log(WinningsNUMBER)

        const FILTER = (m) => m.content.toLowerCase().includes('yes') && m.author.id === target.id ||
            m.content.toLowerCase().includes('no') && m.author.id === target.id ||
            m.content.toLowerCase().includes('no') && m.author.id === message.author.id ||
            m.content.startsWith(prefix) && m.author.id === target.id ||
            m.content.startsWith(prefix) && m.author.id === message.author.id;

        const COLLECTOR = message.channel.createMessageCollector(FILTER, {
            max: 1,
            time: 30000
        });

        COLLECTOR.on("collect", async (m) => {

            const hasLeveledUP = await Levels.appendXp(message.author.id, randomXP);

            const WinnerEMBED = new MessageEmbed()
                .setColor("#ffa500")
                .setTitle(`**WINNER WINNER CHICKEN DINNER**`)
                .setDescription(`<@${chosenWinner}> Won the Fight. Recieving 💰${WinningsNUMBER.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} in Winnings!\n\n${message.author} Earned ${randomXP} XP`)
                .setTimestamp();

            try {

                if (m.content.startsWith(prefix)) {
                    this.cooldown = 0
                    return message.channel.send('You are already in a command. Please end this first!')
                }

                if (m.content.toLowerCase() === 'yes') {
                    await profileModel.findOneAndUpdate({
                        userID: chosenWinner,
                    }, {
                        $inc: {
                            gold: WinningsNUMBER,
                        },

                    });
                    this.cooldown = 60 * 60

                    if (hasLeveledUP) {

                        const user = await Levels.fetch(message.author.id);
                        const target = message.author
                        await profileModel.findOneAndUpdate({
                            userID: target.id,
                        }, {
                            $inc: {
                                gold: 1000,
                                minions: 1
                            },
                        });

                        WinnerEMBED.setFooter(`${message.author.username} You just Advanced to Level ${user.level}!\nYou have gained: 💰+1000 , 🐵+1`)
                    }
                    return message.channel.send(WinnerEMBED)
                }
            } catch (err) {
                console.log(err)
            }
            if (m.content.toLowerCase() === 'no') {
                this.cooldown = 0
                return message.channel.send('The Duel was Cancelled!')
            }
        });


        COLLECTOR.on("end", (collected) => {
            if (collected.size == 0) {
                this.cooldown = 0
                return message.channel.send(
                    `Nobody has answered. Duel Cancelled!`
                );
            }
        });
        if (target) {

            const FightEmbed = new MessageEmbed()
                .setTitle(`**🛡️⚔️ BATTLE ⚔️🛡️**`)
                .setDescription(`${message.author} has commenced a duel with ${target}. Do you accept?`)
                .setThumbnail('https://media1.tenor.com/images/2ae0b895a19beae56d67a1f88f36aecc/tenor.gif')
                .setTimestamp();

            message.channel.send(FightEmbed);
        }
    }

};