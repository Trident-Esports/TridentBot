//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');
const weather = require('weather-js');

module.exports = class WeatherCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "weather",
            aliases: [ "w" ],
            group: "info",
            memberName: "weather",
            description: "Check your weather!",
            guildOnly: true
        }
        super(
            client,
            {...comprops}
        )
    }

    async action(client, message) {
        let degreeType = "C"
        if (["C","F"].includes(this.inputData.args[this.inputData.args.length - 1].toUpperCase())) {
            degreeType = this.inputData.args.pop().toUpperCase()
        }
        let args = this.inputData.args
        let props = { caption: {}, players: { user: {}, bot: {} } }
        let search = this.inputData.args.join(" ").trim()
        if (search == "") {
            this.error = true
            this.props.description = "Please specify a location."
            return
        }
        weather.find({
            search: search,
            degreeType: degreeType
        }, await function(error, result) {
            if(error || !args[0] || result === undefined || result.length === 0) {
                props.error = true
                props.caption.text = "Error"
                props.color = "RED"
                if(error) {
                    props.description = error
                } else if(!args[0]) {
                    props.description = "Please specify a location"
                } else if(result === undefined || result.length === 0) {
                    props.description = "**Invalid** Location"
                } else {
                    props.description = ""
                }
            } else {
                let current = result[0].current;
                let location = result[0].location;
                props.description = `**${current.skytext}**`
                props.caption.text = `Weather forecast for ${current.observationpoint}`
                props.players.bot.url = `https://www.accuweather.com/en/search-locations?query=` + encodeURI(`${current.observationpoint}`)
                props.players.user.avatar = current.imageUrl
                props.fields = [
                    {
                        name: "Timezone",
                        value: "UTC" + (parseInt(location.timezone) >= 0 ? '+' : "") + location.timezone,
                        inline: true
                    },
                    {
                        name: "Degree Type",
                        value: degreeType,
                        inline: true
                    },
                    {
                        name: "Temperature",
                        value: `${current.temperature}°${degreeType}`,
                        inline: true
                    },
                    {
                        name: "Wind",
                        value: current.winddisplay,
                        inline: true
                    },
                    {
                        name: "Feels Like",
                        value: `${current.feelslike}°${degreeType}`,
                        inline: true
                    },
                    {
                        name: "Humidity",
                        value: `${current.humidity}%`,
                        inline: true
                    }
                ]
            }
            let embed = new VillainsEmbed({...props})
            // message.channel.send({ embeds: [embed] })
            message.channel.send(embed)
        })
        // We'll handle sending it
        // SELFHANDLE: Inline Callback
        this.null = true
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "",
          "Sydney, Australia",
          "Sydney, Australia F",
          "97202",
          "97202 F"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new WeatherCommand(client)
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(message, args)
        }
    }
}
