const ModCommand = require('../../classes/modcommand.class');
const db = require('../../../models/warns')

module.exports = class RemoveLongestWarnCommand extends ModCommand {
    constructor() {
        let comprops = {
            name: "removelongestwarn",
            aliases: [
                'rmvlongestwarn',
                'rmvlngstwrn'
            ],
            category: "admin",
            description: "Warns user"
        }
        super(comprops)
    }

    async action(client, message, args) {

        const user = this.inputData.loaded

        if (!user) {
            this.error = true
            this.props.description = this.errors.cantActionSelf
        }

        if (this.DEV) {
            this.props.description = "!! DEV !! - This user has " + data.content.length + " warns. Would delete Warn #" + (isNaN(number) ? 1 : number)
        }

        this.props.description = `Deleted ${user} last warn`

        db.findOne({
            guildID: message.guild.id,
            user: user.id
        }, async (err, data) => {
            if (err) throw err;
            if (data) {
                data.content.splice(0, 1)
                data.save()
            }
        })
    }
}