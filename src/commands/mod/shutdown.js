//@ts-check

const AdminCommand = require('../../classes/command/admincommand.class');
const VillainsCommand = require('../../classes/command/vcommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');
const chalk = require('chalk');

module.exports = class ShutDownCommand extends AdminCommand {
    constructor(context) {
        let comprops = {
            name: "shutdown",
            category: "meta",
            aliases: [ "sh" ],
            description: "Bot Shutdown"
        }
        let props = {
            caption: {
                text: "Bot Shutdown"
            }
        }
        super(
            context,
            {...comprops},
            {...props}
        )
    }

    async run(message, args, cmd) {
        console.log(`!!! Bot Shutdown by: ${message.author.tag} !!!`)
        try {
            // @ts-ignore
            const pm2 = require('pm2')
            let props = this.props
            pm2.connect(function(err) {
                if (err) {
                    console.log(chalk.red("🔴PM2: Error Connecting!"))
                    console.log(chalk.red(err))
                    process.exit(2)
                }

                pm2.list(async (err, list) => {
                    if (err) {
                        console.log(chalk.red("🔴PM2: Error Listing Processes!"))
                    }

                    for(let [, procItem] of Object.entries(list)) {
                        if (procItem.name == "run") {
                            props.description = `Restarting <@${message.client.user.id}>.`
                            //FIXME: BAD BAD HACK!
                            await new VillainsCommand({name:""}).send(message, new VillainsEmbed({...props}))
                            console.log(chalk.yellow(`!!! RESTART`))
                            pm2.restart(procItem.name, (err, proc) => {
                                pm2.disconnect()
                            })
                        }
                    }
                })
            })
        } catch (err) {
            this.props.description = `Shutting down <@${message.client.user.id}>.`
            this.pages.push(new VillainsEmbed({...this.props}))
            await this.send(message, this.pages)
            console.log(chalk.red(`!!! SHUTDOWN`))
            process.exit(1337)
        }
    }
}
