/*

Command for Mods-only

BaseCommand
 VillainsCommand
  AdminCommand
   ModCommand
    IRCVoiceCommand

*/

const ModCommand = require('./modcommand.class');

module.exports = class IRCVoiceCommand extends ModCommand {
}
