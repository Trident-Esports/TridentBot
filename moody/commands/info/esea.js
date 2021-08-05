const { GoogleSpreadsheet } = require('google-spreadsheet');
const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');
const fs = require('fs');

module.exports = class ESEACommand extends VillainsCommand {
    constructor() {
        super({
            name: "esea",
            category: "information",
            description: "Get info about an ESEA game from a specified database"
        })
    }

    async action(client, message) {
        const SENSITIVE = JSON.parse(fs.readFileSync("./SENSITIVE.json", "utf8"))
        const apiKey = SENSITIVE?.google?.apiKey ? SENSITIVE.google.apiKey : ""
        const wantedMatch = this?.inputData?.args[0] ? this.inputData.args[0] : 0

        // Check for API Key
        if (apiKey == "") {
            this.error = true
            this.props.description = "No Google API Key found!"
            return
        }

        // Load workbook
        let docID = SENSITIVE?.google?.sheets?.csgo?.esea ? SENSITIVE.google.sheets.csgo.esea : ""
        if (docID == "") {
            this.error = true
            this.props.description = "No Google Sheet ID found!"
        }
        const wb = new GoogleSpreadsheet(docID)
        wb.useApiKey(apiKey)
        await wb.loadInfo()

        // Load sheet
        const sheet = wb.sheetsByIndex[0]

        // Load cells
        await sheet.loadCells()

        let cellData = []

        // Iterate over rows & cells
        const rows = 50
        let cols = 20
        for (let row = 2; (row - 1) < (rows - 1); row++) {
            if (!(cellData[row - 2])) {
                cellData.push([])
            }
            for (let col = 1; (col - 1) < (cols - 1); col++) {
                let cell = sheet.getCell(row - 1, col - 1)
                delete cell._sheet
                // If cell is empty, next row
                if ((row == 2) && (!(cell.formattedValue))) {
                    cols = (col + 1)
                } else if(cell.formattedValue) {
                    // Store it
                    cellData[row - 2].push(cell.formattedValue)
                }
                // If first cell of row is empty, stop
                if (col == 0 && (!(cell.formattedValue))) {
                    break;
                }
            }
        }

        let matchData = {}
        let matchID = "NaN"
        let match = {}
        for(let record of cellData) {
            // Overall
            if(record.length >= 9) {
                match = {}
                matchID = record[4]
                if(!(isNaN(matchID))) {
                    match.id = matchID
                    match.map = record[9]
                    match.us = { name: record[0], id: record[1], score: parseInt(record[7]) }
                    match.them = { name: record[2], id: record[3], score: parseInt(record[8]) }
                    match.players = []
                    match.scoreKeys = {
                        bySide: {
                            us: match.us.score,
                            them: match.them.score
                        },
                        byName: {
                            [ match.us.name ]: match.us.score,
                            [ match.them.name ]: match.them.score
                        },
                        byStatus: {
                            winner: match.us.score >= match.them.score ? match.us.score : match.them.score,
                            loser: match.us.score <= match.them.score ? match.us.score : match.them.score
                        }
                    }
                    match.winner = match.us.score > match.them.score ? match.us.score : match.them.score
                    match.timestamp = record[6]
                    matchData[matchID] = match
                }
            } else if(!(isNaN(matchID))) {
                // Player Stats
                let player = {}
                player.name = record[0]
                player.ct = {}
                player.ct.k = parseInt(record[1])
                if(!(isNaN(player.ct.k))) {
                  player.ct.d = parseInt(record[2])
                  player.ct.a = parseInt(record[3])
                  player.ct.kd = Number((player.ct.k / player.ct.d).toFixed(2))
                  player.t = {}
                  player.t.k = parseInt(record[4])
                  player.t.d = parseInt(record[5])
                  player.t.a = parseInt(record[6])
                  player.t.kd = Number((player.t.k / player.t.d).toFixed(2))
                  matchData[matchID].players.push(player)
                }
            }
        }

        this.props.description = []
        let emoji = ""
        let emojiKey = "csgo"
        let emojiName = emojiKey

        let foundEmoji = false

        let cachedEmoji = message.guild.emojis.cache.find(emoji => emoji.name === emojiName);
        if (cachedEmoji?.available) {
            foundEmoji = true
            emoji += `${cachedEmoji}`;
        }

        if (!foundEmoji) {
            if (emojiKey) {
                emoji += '[' + emojiKey + "] "
            }
        }


        for(let [matchID, mData] of Object.entries(matchData)) {
            if((wantedMatch > 0) && (matchID != wantedMatch)) {
                continue;
            }
            this.props.fields = []
            this.props.description = []
            let siteRoot = "https://play.esea.net"
            let matchRoot = `${siteRoot}/match`
            this.props.description.push(`__***${emoji} Match***__ *([ESEA #${matchID}](${matchRoot}/${matchID} '${matchRoot}/${matchID}'))*`)
            let teamRoot = `${siteRoot}/teams`
            this.props.description.push(
                ((mData.us.name == mData.winner) ? "🟩" : "🟥") +
                `[${mData.us.name}](${teamRoot}/${mData.us.id} '${teamRoot}/${mData.us.id}')` +
                " 🆚 " +
                `[${mData.them.name}](${teamRoot}/${mData.them.id} '${teamRoot}/${mData.them.id}')` +
                ``
            )
            this.props.description.push(`Started: <t:${mData.timestamp}:f>`)
            this.props.description.push(`Final Score: ${Object.values(mData.scoreKeys.bySide).join(" - ")}`)
            this.props.description.push(`Map: ${mData.map.substr(mData.map.indexOf('_') + 1)}`)
            this.props.description.push()
            this.props.description.push("```")
            this.props.description.push("/-----------------------------------------------\\")
            this.props.description.push("|           |Counter-Terrorist|    Terrorist    |")
            this.props.description.push("|-----------------------------------------------|")
            this.props.description.push("|  Player   |  K/ D: A [K/D ] |  K/ D: A [K/D ] |")
            this.props.description.push("|-----------|---/--:---[-.--]-|---/--:---[-.--]-|")
            for(let player of mData.players) {
                this.props.description.push(
                    `|` +
                    `${player.name.padEnd(10)} | ` +
                    `${(player.ct.k + "").padStart(2)}/${(player.ct.d + "").padStart(2)}:${(player.ct.a + "").padStart(2)} [${(player.ct.kd + "").padEnd(4)}] | ` +
                    `${(player.t.k + "").padStart(2)}/${(player.t.d + "").padStart(2)}:${(player.t.a + "").padStart(2)} [${(player.t.kd + "").padEnd(4)}]` + ' |'
                )
            }
            this.props.description.push("\\-----------------------------------------------/")
            this.props.description.push("```")
            let embed = new VillainsEmbed({...this.props})
            this.send(message, embed)
            this.null = true
        }
    }
}
