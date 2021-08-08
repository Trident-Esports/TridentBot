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
        let wantedMatch = 0
        let wantedSpan = "all"
        if(this?.inputData?.args[0]) {
            let arg = this.inputData.args[0]
            if(["all","complete","incomplete","next"].includes(arg)) {
                wantedSpan = arg
            } else if(!(isNaN(arg))) {
                wantedMatch = arg
            }
        }

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
                if ((col == 1) && ((!(Boolean(cell.formattedValue))) || (cell.formattedValue === null))) {
                    row = rows
                    break;
                }
            }
        }

        const headings = {
            match: cellData[0],
            players: cellData[2]
        }

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

        let matchData = { overall: { ct: 0, t: 0 } }
        let matchID = "NaN"
        let match = {}
        for(let record of cellData) {
            // Overall
            if(record.length >= 9) {
                match = {}
                matchID = record[headings.match.indexOf("Match ID")]
                if(!(isNaN(matchID))) {
                    matchData.overall.ct = parseInt(matchData.overall.ct) + parseInt(record[headings.match.indexOf("Us CT")])
                    matchData.overall.t = parseInt(matchData.overall.t) + parseInt(record[headings.match.indexOf("Us T")])
                    match.id = matchID
                    match.map = record[headings.match.indexOf("Map Name")]
                    match.us = {
                        name: record[headings.match.indexOf("Us Name")],
                        id: record[headings.match.indexOf("Us ID")],
                        score: parseInt(record[headings.match.indexOf("Us Score")])
                    }
                    match.them = {
                        name: record[headings.match.indexOf("Them Name")],
                        id: record[headings.match.indexOf("Them ID")],
                        score: parseInt(record[headings.match.indexOf("Them Score")])
                    }
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
                    match.status = "incomplete"
                    match.winner = ""
                    match.result = emoji
                    if((match.us.score > 0) || (match.them.score > 0)) {
                        match.status = "complete"
                        if(match.us.score > match.them.score) {
                            match.winner = match.us.name
                            match.result = "🟩"
                        } else if(match.us.score < match.them.score) {
                            match.winner = match.them.name
                            match.result = "🟥"
                        } else if(match.us.score == match.them.score) {
                            match.winner = "tie"
                            match.result = "🟨"
                        }
                    }
                    match.timestamp = record[headings.match.indexOf("Timestamp")]
                    matchData[matchID] = match
                }
            } else if(!(isNaN(matchID))) {
                // Player Stats
                let player = {}
                player.name = record[0]
                player.ct = {}
                player.ct.d = parseInt(record[headings.players.indexOf("CT D")])
                if(!(isNaN(player.ct.d))) {
                    player.ct.k = parseInt(record[headings.players.indexOf("CT K")])
                    player.ct.a = parseInt(record[headings.players.indexOf("CT A")])
                    player.ct.kd = Number((player.ct.k / player.ct.d).toFixed(2))
                    player.t = {}
                    player.t.k = parseInt(record[headings.players.indexOf("T K")])
                    player.t.d = parseInt(record[headings.players.indexOf("T D")])
                    player.t.a = parseInt(record[headings.players.indexOf("T A")])
                    player.t.kd = Number((player.t.k / player.t.d).toFixed(2))
                    matchData[matchID].players.push(player)
                }
            }
        }

        this.props.description = []

        let haveShownValidMatch = false
        for(let [matchID, mData] of Object.entries(matchData)) {
            let show = mData?.us?.name
            let singleMatch = (wantedMatch > 0)
            if(wantedSpan != "") {
                if((wantedSpan == "next") && (matchID > 0) && (mData.status == "incomplete")) {
                    show = !(haveShownValidMatch)
                } else if((wantedSpan != "all") && (wantedSpan != mData.status)) {
                    show = false
                }
            }
            if(singleMatch && (matchID != wantedMatch)) {
                show = false
            }
            if(!(show)) {
                continue
            }
            if(matchID > 0) {
                haveShownValidMatch = true
            }

            this.props.fields = []
            this.props.description = []
            let siteRoot = "https://play.esea.net"
            let matchRoot = `${siteRoot}/match`
            this.props.description.push(`__***${emoji} Match List***__ ` + ((matchID > 0) ? `*([ESEA #${matchID}](${matchRoot}/${matchID} '${matchRoot}/${matchID}'))*` : ""))
            let teamRoot = `${siteRoot}/teams`
            this.props.description.push(
                "***" +
                mData.result +
                `[${mData.us.name}](${teamRoot}/${mData.us.id} '${teamRoot}/${mData.us.id}')` +
                " 🆚 " +
                `[${mData.them.name}](${teamRoot}/${mData.them.id} '${teamRoot}/${mData.them.id}')` +
                "***"
            )
            if(mData.timestamp > 0) {
                let start = "Start" + (mData.status != "incomplete" ? "ed" : "ing")
                this.props.description.push(`${start}: <t:${mData.timestamp}:f>`)
                if(mData.status != "incomplete") {
                    this.props.description.push(`[Final Score: ${Object.values(mData.scoreKeys.bySide).join(" - ")}](${matchRoot}/${matchID} '${matchRoot}/${matchID}')`)
                }
            }
            if(singleMatch) {
                if(mData?.map) {
                    let mapName = mData.map.substr(mData.map.indexOf('_') + 1)
                    mapName = mapName.charAt(0).toUpperCase() + mapName.slice(1)
                    let mapURL = "https://counterstrike.fandom.com/wiki/" + mapName
                    this.props.description.push(`Map: [${mapName}](${mapURL} '${mapURL}')`)
                }
                if(mData.players.length > 0) {
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
                }
                this.props.fields.push(
                    {
                        name: "CT🟦",
                        value: matchData.overall.ct,
                        inline: true
                    },
                    {
                        name: "T🟧",
                        value: matchData.overall.t,
                        inline: true
                    }
                )
            }
            let embed = new VillainsEmbed({...this.props})
            this.send(message, embed)
            this.null = true
        }
    }
}
