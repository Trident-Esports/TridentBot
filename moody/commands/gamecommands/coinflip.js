const GameCommand = require('../../classes/gamecommand.class');
const VillainsEmbed = require('../../classes/vembed.class');

module.exports = class CoinFlipCommand extends GameCommand {
    constructor() {
        super({
            name: 'coinflip',
            aliases: [ "cf" ],
            category: 'game',
            description: 'Flip a coin!',
            extensions: [ "profile" ]
        });
    }

    async run(client, message, args) {
        let msg = [
            "**Which side of the coin do you think it will land on?** 🔍",
            "`Heads` `Side` `Tails`"
        ]

        let props = {
            caption: {
                text: "Coin Flip"
            },
            title: {},
            description: msg.join("\n"),
            thumbnail: "https://media.tenor.com/images/60b3d58b8161ad9b03675abf301e8fb4/tenor.gif",
            footer: {
                msg: ""
            },
            players: {
                user: {},
                target: {}
            }
        }

        const user = message.author
        const loaded = user

        props.players.user = {
            name: user.username,
            avatar: user.displayAvatarURL({ format: "png", dynamic: true })
        }
        props.players.target = {
            name: props.caption.text,
            avatar: props.thumbnail
        }

        if (loaded?.bot && loaded.bot) {
            props.title.text = "Error"
            props.description = this.errors.cantActionBot.join("\n")
        }

        if (props.title.text != "Error") {
            let gambledAmount = args && args[0] && args[0].trim() != "" ? args[0].toLowerCase() : -1
            let minGamble = 500

            if (gambledAmount < minGamble) {
                props.title.text = "Error"
                props.description = `You must gamble at least ${this.emojis.gold}${minGamble}. '${gambledAmount}' given.`
            }

            if (props.title.text != "Error") {
                const profileData = await this.profileModel.findOne({
                    userID: loaded.id
                })
                if (gambledAmount == 'all') {
                    gambledAmount = profileData.gold
                }
                if (gambledAmount == 'half') {
                    gambledAmount = profileData.gold / 2
                }

                if (gambledAmount > profileData.gold) {
                    props.title.text = "Error"
                    props.description = `You seem to be a bit short on money there. '${gambledAmount}' given and you've got ${this.emojis.gold}${profileData.gold}.`
                }

                if (props.title.text != "Error") {
                    const variables = [
                        "Heads",
                        "Tails",
                        "Side",
                    ];

                    let chosenVariable = variables.sort(() => Math.random() - Math.random()).slice(0, 3);

                    let [minMinions, maxMinions] = [1, 3]
                    const RANDOM_MINIONS = Math.floor(Math.random() * (maxMinions - minMinions)) + minMinions;

                    const FILTER = (m) => {
                        return chosenVariable.some((answer) => answer.toLowerCase() === m.content.toLowerCase()) && m.author.id === loaded.id;
                    };

                    const COLLECTOR = message.channel.createMessageCollector(FILTER, {
                        max: 1,
                        time: 15000
                    });

                    props["success"] = {
                        "color": "#00FF00",
                        "title": "CONGRATULATIONS"
                    }
                    props["fail"] = {
                        "color": "#FF0000",
                        "title": "SADNESS"
                    }
                    props["special"] = {
                        "color": "#0000FF",
                        "title": "OMG"
                    }

                    COLLECTOR.on("collect", async (m) => {

                        var number = Math.round(Math.random() * 100);

                        var Heads = 50;
                        var Tails = 50;
                        var Side = 2;

                        try {
                            let gotHeads = number <= Heads && m.content.toLowerCase() === 'heads';
                            let gotTails = number <= Tails && m.content.toLowerCase() === 'tails';
                            if (gotHeads || gotTails) {
                                await this.profileModel.findOneAndUpdate({
                                    userID: loaded.id,
                                }, {
                                    $inc: {
                                        gold: gambledAmount,
                                    },
                                });
                                console.log((gotHeads ? "Heads" : "Tails" + ':'),number)
                                props.color = props.success.color
                                props.title.text = props.success.title
                                props.description = `You chose ${m.content} and won ${this.emojis.gold}${gambledAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.`
                            } else if (number <= Side && m.content.toLowerCase() === 'side') {
                                await this.profileModel.findOneAndUpdate({
                                    userID: loaded.id,
                                }, {
                                    $inc: {
                                        gold: -1,
                                        minions: RANDOM_MINIONS,
                                    },
                                });
                                console.log("Side:",number)
                                props.color = props.special.color
                                props.title.text = props.special.title
                                props.description = `You go to flip the coin and it lands on its ${m.content} and for some reason you find ${RANDOM_MINIONS} Minions grabbing the coin.\n\nThey are now yours!`
                            } else {
                                await this.profileModel.findOneAndUpdate({
                                    userID: loaded.id,
                                }, {
                                    $inc: {
                                        gold: -gambledAmount,
                                    },
                                });
                                console.log("Fail:",number)
                                props.color = props.fail.color
                                props.title.text = props.fail.title
                                props.description = `You chose ${m.content} and the coin didn't land on that. this means you just lost ${this.emojis.gold}${gambledAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n Maybe a bad idea or just Unlucky.`
                            }

                            let embed = new VillainsEmbed(props)
                            await this.send(message, embed)
                        } catch (err) {
                            console.log("Error:",err)
                            console.log("Number:",number)
                        }
                    });

                    COLLECTOR.on("end", async (collected) => {
                        if (collected.size == 0) {
                            await this.profileModel.findOneAndUpdate({
                                userID: loaded.id,
                            }, {
                                $inc: {
                                    gold: -1,
                                },
                            });
                            props.description = `You forgot to flip the coin and it fell out of your hand and rolled away. You lost 💰1.`
                            props.description = `<@${loaded.id}>` + "\n" + props.description

                            let embed = new VillainsEmbed(props)
                            await this.send(message, embed)
                        }
                    });

                    props.description = `<@${loaded.id}>` + "\n" + props.description

                }
            }
        }

        let embed = new VillainsEmbed(props)
        await this.send(message, embed);
    }
}
