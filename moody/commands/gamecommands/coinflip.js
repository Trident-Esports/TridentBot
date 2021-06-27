const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class CoinflipCommand extends GameCommand {
    constructor() {
        super({
            name: 'coinflip',
            aliases: ['cf'],
            category: 'game',
            description: 'Coinflip for coins',
            extensions: ["profile"]
        });
    }

    async run(client, message, args) {

        let props = {
            title: {
                text: "Coinflip"
            },
            description: "**Which side of the coin do you think it will land on?** 🔍",
            footer: {
                msg: ""
            }
        }

        const profileData = await this.profileModel.findOne({ userID: message.author.id });

        var gambledAmount = args[0].toLowerCase() || args[0]

        if (gambledAmount == 'all') {
            gambledAmount = profileData.gold
        }
        if (gambledAmount == 'half') {
            gambledAmount = profileData.gold / 2
        }

        if (gambledAmount > profileData.gold) return message.channel.send('You seem to be abit short on money there');

        if (gambledAmount < 500) return message.channel.send('You must gamble atleast 💰500!');

        if (isNaN(gambledAmount) || undefined) return message.channel.send(`${message.author}, the correct usage of this command is \`.cf [$]\`.`);

        const variables = [
            "Heads",
            "Tails",
            "Side",
        ];

        let chosenVariable = variables.sort(() => Math.random() - Math.random()).slice(0, 3);

        const RANDOM_MINIONS = Math.floor(Math.random() * 2) + 1;

        const FILTER = (m) => {
            return chosenVariable.some((answer) => answer.toLowerCase() === m.content.toLowerCase()) && m.author.id === message.author.id;
        };

        const COLLECTOR = message.channel.createMessageCollector(FILTER, {
            max: 1,
            time: 15000
        });

        props.thumbnail = 'https://media.tenor.com/images/60b3d58b8161ad9b03675abf301e8fb4/tenor.gif'

        props.description = `<@${message.author.id}>
        ${props.description}
        \`${chosenVariable.join("` `")}\``

        const Choose_embed = new VillainsEmbed(props)
        message.channel.send(Choose_embed);

        COLLECTOR.on("collect", async (m) => {

            var number = Math.round(Math.random() * 100);

            var Heads = 50;
            var Tails = 50;
            var Side = 2;

            let COINFLIP_EMBED = new VillainsEmbed(props)

            try {
                let gotHeads = number <= Heads && m.content.toLowerCase() === 'heads';
                let gotTails = number <= Tails && m.content.toLowerCase() === 'tails';
                if (gotHeads || gotTails) {
                    await this.profileModel.findOneAndUpdate({
                        userID: message.author.id,
                    }, {
                        $inc: {
                            gold: gambledAmount,
                        },
                    });

                    props.title.text = "**CONGRATULATIONS**"
                    props.description = `You chose ${m.content} and won 💰${gambledAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.`
                    props.color = "#00FF00"

                    return message.channel.send(COINFLIP_EMBED);

                } else if (number <= Side && m.content.toLowerCase() === 'side') {
                    await this.profileModel.findOneAndUpdate({
                        userID: message.author.id,
                    }, {
                        $inc: {
                            gold: -1,
                            minions: RANDOM_MINIONS,
                        },
                    });
                    props.title.text = "**OMG**"
                    props.description = `You go to flip the coin and it lands on its ${m.content} and for some reason you find ${RANDOM_MINIONS} Minions grabbing the coin.
                    
                    They are now yours!`
                    props.color = "#0000FF"

                    return message.channel.send(COINFLIP_EMBED);

                } else {
                    await this.profileModel.findOneAndUpdate({
                        userID: message.author.id,
                    }, {
                        $inc: {
                            gold: -gambledAmount,
                        },
                    });
                    props.title.text = "**SADNESS**"
                    props.description = `You chose ${m.content} and the coin didn't land on that. this means you just lost 💰${gambledAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    Maybe a bad idea or just Unlucky.`
                    props.color = "#FF0000"

                    return message.channel.send(COINFLIP_EMBED);
                }
            } catch (err) {
                console.log(err)
            }
        });

        COLLECTOR.on("end", async (collected) => {
            if (collected.size == 0) {
                await this.profileModel.findOneAndUpdate({
                    userID: message.author.id,
                }, {
                    $inc: {
                        gold: -1,
                    },
                });

                props.description = `${message.author} forgets to flip the coin and it falls out of their hand and rolls away.`
                props.fields = [{
                    name: `-${emojis.gold}${randomNumber.toLocaleString()}`,
                    value: "Gold",
                    inline: true
                }]

                let Nothing_embed = new VillainsEmbed(props)
                return message.channel.send(Nothing_embed);
            }
        });
    }
}
