// @ts-check

const VillainsCommand = require('./vcommand.class');
const VillainsEmbed = require('../embed/vembed.class');

/**
 * @class
 * @classdesc Command for getting reaction votes for a question/suggestion/survey
 * @this {QuestionnaireCommand}
 * @extends {VillainsCommand}
 * @public
 */
module.exports = class QuestionnaireCommand extends VillainsCommand {
    /**
     * @type {Array.<string>} List of emojis for use in Game Commands
     * @private
     */
    #emojis;
    /**
     * @type {string} Channel name to send message to
     * @private
     */
    #channelName;

    /**
     * Constructor
     * @param {Object.<string, any>} comprops List of command properties from child class
     */
    constructor(comprops = {}) {
        // Create a parent object
        super(
            {...comprops}
        )

        this.emojis = comprops?.emojis ? comprops.emojis : [ "👍", "👎" ];
        this.channelName = comprops?.channelName ? comprops.channelName : "suggestions"
    }

    /**
     * Get emojis
     *
     * @returns {Array.<string>} List of emoji shortcuts
     */
    get emojis() {
        return this.#emojis;
    }
    /**
     * Set emojis
     *
     * @param {Array.<string>} emojis List of emoji shortcuts to set
     */
    set emojis(emojis) {
        this.#emojis = emojis
    }

    /**
     * Get Channel name
     *
     * @returns {string} Get Channel name
     */
    get channelName() {
        return this.#channelName;
    }
    /**
     * Set Channel name
     *
     * @param {string} channelName Set Channel name
     */
    set channelName(channelName) {
        this.#channelName = channelName
    }

    async build(client, message) {
        // Delete user-sent message
        message.delete()

        // Bail if no topic sent
        // Need a topic to build Questionnaire for
        if (this.inputData.args.length <= 0 || this.inputData.args[0].trim() == "") {
            this.error = true
            this.props.description = "No topic sent!"
            return
        } else {
            this.props.description = this.inputData.args.join(" ")
        }

        // Get channel object to send message to
        this.channel = await this.getChannel(message, this.channelName)

        // Bail if we couldn't get a channel object
        if (!this.channel) {
            this.error = true
            this.props.description = this.props.caption.text + " channel doesn't exist!"
            return
        }

        this.action(client, message)
    }

    async action(client, message) {
        this.null = true
        //TODO: Add a .then() to VillainsCommand's run()
        await this.send(message, new VillainsEmbed({...this.props})).then(async (msg) => {
            for (let emoji of this.emojis) {
                await msg.react(emoji)
            }
        })
    }
}
