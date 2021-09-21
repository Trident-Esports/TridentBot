//@ts-check

const VillainsCommand = require('../../classes/command/vcommand.class');

/**
 * Manual tests:
 * fun/giveaway
 *
 * game/coinflip
 * game/fight
 * game/give
 * game/refund
 * game/rob
 * game/search
 * game/steal
 * game/use
 *
 * mod/clear
 * mod/purge
 * mod/shutdown
 *
 * ticketsystem/qbticket
 * ticketsystem/tbticket
 * ticketsystem/ticket
 */

module.exports = class TestSuiteCommand extends VillainsCommand {
    constructor(client) {
        let comprops = {
            name: "testsuite",
            group: "diag",
            memberName: "testsuite",
            description: "This is a filler for Test Suite"
        }
        super(
            client,
            {...comprops},
            {}
        )
    }

    async run(message, args) {
        // do nothing
    }

    async test(message, args) {
        // do nothing
    }
}
