//@ts-check

const QuestionnaireCommand = require('../../classes/command/questionnairecommand.class');

module.exports = class SurveyCommand extends QuestionnaireCommand {
    constructor() {
        let comprops = {
            name: "survey",
            category: "meta",
            description: "Survey",
            channelName: "survey",
            emoji: [ "✅", "❌" ]
        }
        super(comprops)
    }
}
