//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

module.exports = class UptimeCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "uptime",
            category: "meta",
            description: "Bot Uptime"
        }
        let props = {
            caption: {
                text: "Bot Uptime"
            }
        }
        super(
            {...comprops},
            {...props}
        )
    }

    async timeConversion(duration = 0) {
        const portions = [];
        const msInSec = 1000;
        const msInMin = msInSec * 60;
        const msInHour = msInMin * 60;
        const msInDay = msInHour * 24;

        const days = Math.trunc(duration / msInDay)
        if (days > 0) {
            portions.push(days + 'd')
            duration -= (days * msInDay)
        }

        const hours = Math.trunc(duration / msInHour)
        if (hours > 0) {
            portions.push(hours + 'h')
            duration -= (hours * msInHour)
        }

        const minutes = Math.trunc(duration / msInMin)
        if (minutes > 0) {
            portions.push(minutes + 'm')
            duration -= (minutes * msInMin)
        }

        const seconds = Math.trunc(duration / msInSec)
        if (seconds > 0) {
            portions.push(seconds + 's')
        }
        return portions.join(' ')
    }

    async action(client, message) {
        const uptime = client.uptime
        this.props.description = [
            `<@${client.user.id}> has been online for:`,
            await this.timeConversion(uptime)
        ]
    }

    async test(client, message) {
        let dummy = null
        dummy = new UptimeCommand()
        dummy.run(client, message, [], null, "")
    }
}
