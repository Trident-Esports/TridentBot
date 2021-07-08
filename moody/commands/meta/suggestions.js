const QuestionnaireCommand = require('../../classes/questionnairecommand.class');

// Suggestions
module.exports = class SuggestionsCommand extends QuestionnaireCommand {
    constructor() {
        let comprops = {
            name: "suggestions",
            aliases: [ "suggest", "suggestion" ],
            category: "meta",
            description: "Suggestions"
        }
        super(comprops)
    }
}
