const QuestionnaireCommand = require('../../classes/questionnairecommand.class');

// Survey
module.exports = class SurveyCommand extends QuestionnaireCommand {
    constructor() {
        let comprops = {
            name: "survey",
            category: "meta",
            description: "Survey",
            channelName: "survey",
            emoji: [ "✅", "❌" ]
        }
        super(
            {...comprops}
        )
    }
}
