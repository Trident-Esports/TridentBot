//@ts-check

const QuestionnaireCommand = require('../../classes/command/questionnairecommand.class');

module.exports = class SuggestionsCommand extends QuestionnaireCommand {
    constructor(client) {
        let comprops = {
            name: "suggestions",
            aliases: [ "suggest", "suggestion" ],
            group: "meta",
            memberName: "suggestions",
            description: "Suggestions",
            guildOnly: true,
            args: [
                {
                    key: "description",
                    prompt: "What do you want to suggest?",
                    type: "string"
                }
            ]
        }
        super(
            client,
            {...comprops}
        )
    }
}
