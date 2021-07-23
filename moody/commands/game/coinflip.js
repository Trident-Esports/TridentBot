const GameCommand = require('../../classes/command/gamecommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');

module.exports = class CoinFlipCommand extends GameCommand {
    //FIXME: Footer getting smudged?
    constructor() {
        let comprops = {
            name: 'coinflip',
            aliases: [ "cf" ],
            category: 'game',
            description: 'Flip a coin!',
            extensions: [ "profile" ]
        }
        let props = {
            caption: {
                text: "Coin Flip"
            },
            title: {},
            thumbnail: ""
        }
        super(comprops, props)
    }

    async action(client, message) {
        const loaded = this.inputData.loaded

        if(!(this?.props?.title?.text)) {
            if(!(this?.props?.title)) {
                this.props.title = { text: ""}
            }
            this.props.title.text = ""
        }

        this.props.description = [
            "**Which side of the coin do you think it will land on?** 🔍",
            "`Heads` `Side` `Tails`"
        ].join("\n");
        this.thumbnail = "https://media.tenor.com/images/60b3d58b8161ad9b03675abf301e8fb4/tenor.gif"

        if (!(this.error)) {
            let gambledAmount = this.inputData.args && this.inputData.args[0] && (!(isNaN(this.inputData.args[0]))) ? parseInt(this.inputData.args[0]) : -1
            let minGamble = 500

            if (gambledAmount < minGamble) {
                this.error = true
                this.props.description = `You must gamble at least ${this.emojis.gold}${minGamble}. '${gambledAmount}' given.`
            }

            if (!(this.error)) {
                const profileData = await this.db_query(loaded.id, "profile")
                if (gambledAmount == 'all') {
                    gambledAmount = profileData.gold
                }
                if (gambledAmount == 'half') {
                    gambledAmount = profileData.gold / 2
                }

                if (gambledAmount > profileData.gold) {
                    this.error = true
                    this.props.description = `You seem to be a bit short on money there. '${gambledAmount}' given and you've got ${this.emojis.gold}${profileData.gold}.`
                }

                if (!(this.error)) {
                    const variables = [
                        "Heads",
                        "Tails",
                        "Side",
                    ];
                    const shortvars = variables.map((e) => e.charAt(0))

                    let [minMinions, maxMinions] = [1, 3]
                    const RANDOM_MINIONS = Math.floor(Math.random() * (maxMinions - minMinions)) + minMinions;

                    const FILTER = (m) => {
                        return shortvars.some((answer) => answer.charAt(0).toLowerCase() === m.content.charAt(0).toLowerCase()) && m.author.id === loaded.id;
                    };

                    const COLLECTOR = message.channel.createMessageCollector(FILTER, {
                        max: 1,
                        time: 15000
                    });

                    this.props["success"] = {
                        "color": "#00FF00",
                        "title": "CONGRATULATIONS"
                    }
                    this.props["fail"] = {
                        "color": "#FF0000",
                        "title": "SADNESS"
                    }
                    this.props["special"] = {
                        "color": "#0000FF",
                        "title": "OMG"
                    }

                    COLLECTOR.on("collect", async (m) => {

                        let number = Math.round(Math.random() * 100);

                        let Heads = 50;
                        let Tails = 50;
                        let Side = 2;

                        try {
                            let gotHeads = number <= Heads && m.content.charAt(0).toLowerCase() === 'h';
                            let gotTails = number <= Tails && m.content.charAt(0).toLowerCase() === 't';
                            let choice = ""
                            switch(m.content.charAt(0).toLowerCase()) {
                                case 'h':
                                    choice = "Heads"
                                    break
                                case 't':
                                    choice = "Tails"
                                    break
                                case 's':
                                    choice = "Side"
                                    break
                            }
                            if (gotHeads || gotTails) {
                                await this.db_transform(loaded.id, "gold", gambledAmount)

                                console.log((gotHeads ? "Heads" : "Tails" + ':'),number)
                                this.props.color = this.props.success.color
                                this.props.title.text = this.props.success.title
                                this.props.description = `You chose ${choice} and won ${this.emojis.gold}${gambledAmount.toString()}.`
                            } else if (number <= Side && m.content.charAt(0).toLowerCase() === 's') {
                                await this.db_transform(loaded.id,
                                    {
                                        gold: -1,
                                        minions: RANDOM_MINIONS
                                    }
                                )

                                console.log("Side:",number)
                                this.props.color = this.props.special.color
                                this.props.title.text = this.props.special.title
                                this.props.description = `You go to flip the coin and it lands on its ${choice} and for some reason you find ${RANDOM_MINIONS} Minions grabbing the coin.\n\nThey are now yours!`
                            } else {
                                await this.db_transform(loaded.id, "gold", -gambledAmount)

                                console.log("Fail:",number)
                                this.props.color = this.props.fail.color
                                this.props.title.text = this.props.fail.title
                                this.props.description = `You chose ${choice} and the coin didn't land on that. this means you just lost ${this.emojis.gold}${gambledAmount.toString()}\n Maybe a bad idea or just Unlucky.`
                            }

                            let embed = new VillainsEmbed(this.props)
                            await this.send(message, embed)
                        } catch (err) {
                            console.log("Error:",err)
                            console.log("Number:",number)
                        }
                        this.null = true
                    });

                    COLLECTOR.on("end", async (collected) => {
                        if (collected.size == 0) {
                            await this.db_transform(loaded.id, "gold", -1)

                            this.props.description = `You forgot to flip the coin and it fell out of your hand and rolled away. You lost 💰1.`
                            this.props.description = `<@${loaded.id}>` + "\n" + this.props.description

                            let embed = new VillainsEmbed(this.props)
                            await this.send(message, embed)
                        }
                        this.null = true
                    });

                    this.props.description = `<@${loaded.id}>` + "\n" + this.props.description
                }
            }
        }
    }
}
