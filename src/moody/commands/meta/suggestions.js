//@ts-check

const QuestionnaireCommand = require('../../classes/command/questionnairecommand.class');

module.exports = class SuggestionsCommand extends QuestionnaireCommand {
    constructor() {
        let comprops = {
            name: "suggestions",
            aliases: [ "suggest", "suggestion" ],
            category: "meta",
            description: "Suggestions"
        }
        super(
            {...comprops}
        )
    }
}
