const { BaseCommand } = require('a-djs-handler');
const VillainsEmbed = require('../classes/vembed.class');

const weather = require('weather-js');

module.exports = class WeatherCommand extends BaseCommand {
    constructor() {
        super({
            name: "weather",
            category: "diagnostic",
            description: "Check your weather!"
        })
    }

    async run(client, message, args) {
        let props = {
            color:        "",
            author:       {},
            thumbnail:    "",
            title:        { text: "Weather" },
            description:  "",
            fields:       {},
            image:        "",
            footer:       {},
            pages:        false
        }

        let degreeType = "C"
        weather.find({
            search: args.join(" "),
            degreeType: degreeType
        }, function(error, result) {
            if(error || !args[0] || result === undefined || result.length === 0) {
                props.title.text = "Error"
                props.color = "RED"
                if(error) {
                    props.description = error
                } else if(!args[0]) {
                    props.description = "Please specify a location"
                } else if(result === undefined || result.length === 0) {
                    props.description = "**Invalid** Location"
                } else {
                    props.description = "Something got stuffed up here..."
                }
            } else {
                let current = result[0].current;
                let location = result[0].location;
                props.description = `**${current.skytext}**`
                props.title.text = `Weather forecast for ${current.observationpoint}`
                props.thumbnail = current.imageUrl
                props.fields = [
                    {
                        name: "Timezone",
                        value: `UTC${location.timezone}`,
                        inline: true
                    },
                    {
                        name: "Degree Type",
                        value: degreeType,
                        inline: true
                    },
                    {
                        name: "Temperature",
                        value: `${current.temperature}°` + degreeType,
                        inline: true
                    },
                    {
                        name: "Wind",
                        value: current.winddisplay,
                        inline: true
                    },
                    {
                        name: "Feels Like",
                        value: `${current.feelslike}°` + degreeType,
                        inline: true
                    },
                    {
                        name: "Humidity",
                        value: `${current.humidity}%`,
                        inline: true
                    }
                ]
            }
            let embed = new VillainsEmbed(
                props.color,
                props.author,
                props.thumbnail,
                props.title,
                props.description,
                props.fields,
                props.image,
                props.footer,
                props.pages
            )
            message.channel.send(embed)
        })
    }
}
