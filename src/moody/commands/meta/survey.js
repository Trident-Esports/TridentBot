//@ts-check

const QuestionnaireCommand = require('../../classes/command/questionnairecommand.class');

module.exports = class SurveyCommand extends QuestionnaireCommand {
    constructor(client) {
        let comprops = {
            name: "survey",
            group: "meta",
            memberName: "survey",
            description: "Survey",
            guildOnly: true
        }
        super(
            client,
            {...comprops},
            {
              channelName: "survey",
              emoji: [ "✅", "❌" ]
            }
        )
    }
}
