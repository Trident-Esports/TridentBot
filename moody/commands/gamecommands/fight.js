const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class FightCommand extends GameCommand {
    constructor() {
        super({
            name: 'fight',
            aliases: ["battle"],
            cooldown: 60 * 60,
            category: 'game',
            description: 'Choose your player to fight and get bragging rights',
            extensions: ["levels", "profile"]
        });
    }

    async run(client, message, args) {

        /*
        User:   Invalid
        Target: Valid
        Bot:    Invalid
        */
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        let props = {
            title: {
                text: "🛡️⚔️ BATTLE ⚔️🛡️"
            },
            thumbnail: "https://media1.tenor.com/images/2ae0b895a19beae56d67a1f88f36aecc/tenor.gif",
            description: `${message.author} has commenced a duel with ${target}. Do you accept?`,
            footer: {
                msg: ""
            }
        }

        const prefix = '.'

        const randomXP = Math.floor(Math.random() * 300) + 300;

        if (!target) {
            //cooldown = 0
            return message.reply("Bruh, you can't fight no one.");
        }

        if (target.id === message.author.id) {
            //cooldown = 0
            return message.reply('You cannot fight yourself wtf?!?');
        }

        if (target.user.bot) {
            //cooldown = 5 * 60
            return message.reply("Now who's the Bot?🤡\nFight someone who isn't a bot dummy!");
        }

        const Contestants = [
            message.author.id,
            target.id,
        ];

        let chosenWinner = Contestants.sort(() => Math.random() - Math.random()).slice(0, 1);
        let WinningsNUMBER = Math.floor(Math.random() * 1500) + 1200;

        const FILTER = (m) => m.content.toLowerCase().includes('yes') && m.author.id === target.id || // tagged player says yes
            m.content.toLowerCase().includes('no') && m.author.id === target.id || // tagged player says no
            m.content.toLowerCase().includes('no') && m.author.id === message.author.id || // fight starter says no
            m.content.startsWith(prefix) && m.author.id === target.id || // player trys to do another command while fight is happening // needs fixing
            m.content.startsWith(prefix) && m.author.id === message.author.id; // fight starter tries to use another command during fight // needs fixing

        const COLLECTOR = message.channel.createMessageCollector(FILTER, {
            max: 1,
            time: 30 * 1000 // 30 seconds
        });

        COLLECTOR.on("collect", async (m) => {

            const hasLeveledUP = await this.Levels.appendXp(message.author.id, 1, randomXP);

            props.color = "#FF5000"
            props.title = "WINNER WINNER CHICKEN DINNER"
            props.description = `<@${chosenWinner}> Won the Fight. Recieving 💰${WinningsNUMBER.toString()} in Winnings!

                ${message.author} Earned ${randomXP} XP`

            if (m.content.startsWith(prefix)) {
                return message.reply('You are already in a command. Please end this first!');
            }

            if (m.content.toLowerCase() === 'yes') {
                await this.profileModel.findOneAndUpdate({
                    userID: chosenWinner,
                }, {
                    $inc: {
                        gold: WinningsNUMBER,
                    },
                });

                if (hasLeveledUP) {
                    const user = await this.Levels.fetch(message.author.id, 1);
                    const target = message.author
                    await this.profileModel.findOneAndUpdate({
                        userID: target.id,
                    }, {
                        $inc: {
                            gold: 1000,
                            minions: 1
                        },
                    });

                    props.footer.msg = `${message.author.username} You just Advanced to Level ${user.level}!
                        You have gained: 💰+1000 , 🐵+1`
                }

                let embed = new VillainsEmbed(props)
                this.send(message, embed);
            }

            if (m.content.toLowerCase() === 'no') {
                return message.channel.send('The Duel was Cancelled!')
            }
        });

        COLLECTOR.on("end", (collected) => {
            if (collected.size == 0) {
                //cooldown = 0
                return message.reply(`Nobody has answered. Duel Cancelled!`);
            }
        });

        let embed = new VillainsEmbed(props)
        this.send(message, embed);
    }
};