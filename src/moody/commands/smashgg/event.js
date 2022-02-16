const VillainsCommand = require('../../classes/command/vcommand.class');
const VillainsEmbed = require('../../classes/embed/vembed.class');
const { GraphQLClient } = require('graphql-request');
const fs = require('fs');
require('dotenv').config()

module.exports = class SmashGGEvent extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "smashevent",
            aliases: ["smash"],
            category: "smashgg",
            description: "SmashGG Event Listing",
        }
        super(
            {...comprops}
        )
    }

    async getTournamentBySlug(gqlclient, slug) {
        // Set Vars
        const variables = {
          tourneySlug: slug
        }
        // Set Query
        const query = `
          {
            tournament(slug: "${variables.tourneySlug}") {
              events {
                id
                slug
              }
            }
          }
        `
        // Send Query
        return await gqlclient.request(query)
    }

    async getEventStandings(gqlclient, eventID) {
        // Set Vars
        const variables = {
          eventId: eventID,
          page: 1,
          perPage: 500
        }
        // Set Query
        const query = `
          {
            event(id: ${variables.eventId}) {
              id
              name
              slug
              standings(query: {
                page: ${variables.page},
                perPage: ${variables.perPage}
              }){
                nodes {
                  placement
                  entrant {
                    id
                    name
                  }
                }
              }
            }
          }
        `
        // Send Query
        return await gqlclient.request(query)
    }

    async getEventSets(gqlclient, eventID) {
        // Set Vars
        const variables = {
          eventId: eventID,
          page: 1,
          perPage: 500
        }
        // Set Query
        const query = `
          {
            event(id: ${variables.eventId}) {
              id
              name
              slug
              sets(
                page: ${variables.page}
                perPage: ${variables.perPage}
                sortType: STANDARD
              ) {
                pageInfo {
                  total
                }
                nodes {
                  id
                  slots {
                    id
                    entrant {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        `
        // Send Query
        return await gqlclient.request(query)
    }

    async getSetStats(gqlclient, setID) {
        // Set Vars
        const variables = {
          setId: setID
        }
        // Set Query
        const query = `
          {
            set(id: ${variables.setId}) {
              id
              completedAt
              startedAt
              state
              fullRoundText
              identifier
              phaseGroup {
                id
                phase {
                  id
                  name
                }
              }
              slots {
                id
                standing {
                  id
                  placement
                  stats {
                    score {
                      label
                      value
                    }
                  }
                }
              }
            }
          }
        `
        // Send Query
        return await gqlclient.request(query)
    }

    async action(client, message) {
        // Connect to SmashGG API
        const endpoint = "https://api.smash.gg/gql/alpha"
        const GQLClient = new GraphQLClient(endpoint, {
            headers: {
                "Authorization": `Bearer ${process.env.smashGG_apiKey}`
            }
        })

        let guildSGGdata = null
        try {
            let guildData = JSON.parse(fs.readFileSync(`./src/dbs/${message.guild.id}/data.json`,"utf8"))
            if ("smashGG" in guildData) {
                guildSGGdata = guildData.smashGG
                if ("fall2021" in guildSGGdata) {
                    guildSGGdata = guildSGGdata.fall2021
                } else {
                    this.error = true
                    this.description = "No Fall2021 SmashGG data found!"
                    return
                }
            } else {
                this.error = true
                this.description = "No SmashGG data found!"
                return
            }
        } catch (err) {
            this.error = true
            this.props.description = err
            return
        }

        let tourneyData = ""
        if (this.inputData.args[0]) {
            tourneyData = this.inputData.args[0]
        } else if ("tourney" in guildSGGdata) {
            tourneyData = guildSGGdata.tourney.slug
        }
        let eventData = ""
        if (this.inputData.args[1]) {
            eventData = this.inputData.args[1]
        } else if ("event" in guildSGGdata) {
            eventData = guildSGGdata.event.idx
        } else {
            eventData = "0"
        }

        if (tourneyData == "") {
            this.error = true
            this.props.description = "No Tourney ID found!"
            return
        }
        if (eventData == "") {
            this.error = true
            this.props.description = "No Event ID found!"
        }

        // Get Event ID
        let tourneySlug = tourneyData
        let eventIDX = eventData
        let data = {}
        try {
            data = await this.getTournamentBySlug(GQLClient, tourneySlug)
        } catch (err) {
            this.error = true
            this.props.description = err
            return
        }
        const eventID = data.tournament.events[eventIDX].id

        try {
            // Get Event Standings
            data = await this.getEventStandings(GQLClient, eventID)
        } catch (err) {
            this.error = true
            this.props.description = err
            return
        }

        // Start Event Object
        let event = {
          id: data.event.id,
          name: data.event.name,
          slug: {
            tournament: tourneySlug,
            event: data.event.slug
          },
          teams: {},
          sets: {}
        }

        this.props.caption = {
            text: event.name,
            url: `https://smash.gg/${event.slug.event}`
        }
        this.props.players.author = this.props.caption

        // Save Team IDs, Names & Placements
        for(let node of data.event.standings.nodes) {
            event.teams[node.entrant.id] = {id: node.entrant.id, name: node.entrant.name, placement: node.placement}
        }

        try {
            data = await this.getEventSets(GQLClient, eventID)
        } catch (err) {
            this.error = true
            this.props.description = err
            return
        }

        // Save Set IDs, Teams
        for(let node of data.event.sets.nodes) {
            if (node.slots.length > 0) {
                let setID = node.id
                let keyID = setID
                if ((setID + "").includes("preview_")) {
                    setID = setID.match("preview_([^_]+)")[1]
                    keyID = keyID.match("preview_(.*)")[1]
                }
                event.sets[keyID] = {
                    id: setID,
                    node_id: node.id
                }
                event.sets[keyID]["slots"] = {}
                event.sets[keyID]["score"] = {}
                for (let slot of node.slots) {
                    if (slot?.id && slot?.entrant?.id) {
                        let slotID = slot.id
                        if ((slot.id + "").includes("preview_")) {
                            slotID = slot.id.match("preview_(.*)")[1]
                        }
                        event.sets[keyID]["slots"][slotID] = slot.entrant.id
                    }
                }
                if (Object.keys(event.sets[keyID]["slots"]).length > 0) {
                    let set = {}
                    try {
                        set = await this.getSetStats(GQLClient, setID)
                    } catch (err) {
                        this.error = true
                        this.props.description = err
                        return
                    }
                    if (set?.set) {
                        event.sets[keyID]["completedAt"] = set.set.completedAt
                        event.sets[keyID]["startedAt"] = set.set.startedAt
                        event.sets[keyID]["state"] = set.set.state
                        event.sets[keyID]["fullRoundText"] = set.set.fullRoundText
                        event.sets[keyID]["identifier"] = set.set.identifier
                        event.sets[keyID]["phaseGroup"] = set.set.phaseGroup
                        // console.log(JSON.stringify(set,undefined,2))
                        for (let sSlot of set.set.slots) {
                            if (sSlot?.standing?.stats?.score) {
                                let teamID = event.sets[keyID]["slots"][sSlot.id]
                                if (teamID) {
                                    let score = sSlot.standing.stats.score.value
                                    if (score == -1) {
                                        score = "DQ"
                                    }
                                    event.sets[keyID]["score"][teamID.toString()] = score
                                }
                            }
                        }
                    }
                } else {
                    delete event.sets[keyID]
                }
            }
        }

        this.props.description = []
        this.props.description.push("***Teams***")

        let teamsByPlacement = Object.values(event.teams).slice(0).sort(function(a,b) {
            if (a.placement == b.placement) {
                let x = a.name.toLowerCase()
                let y = b.name.toLowerCase()
                return x < y ? -1 : x > y ? 1 : 0
            } else {
                return a.placement - b.placement
            }
        })
        for (let team of teamsByPlacement) {
            let url = `https://smash.gg/tournament/${event.slug.tournament}/event/0/entrant/${team.id}`
            this.props.description.push(`\`${(team.placement + "").padStart(3,' ')}\` [${team.name}](${url} '${url}')`)
        }
        if (teamsByPlacement.length == 0) {
            this.props.description.push("No teams found!")
        }
        this.send(message, new VillainsEmbed(this.props))

        this.props.description = []
        this.props.description.push("***Sets***")
        let lastRoundText = ""
        let i = 0
        for (let [setID, set] of Object.entries(event.sets)) {
            let teams = set?.identifier ? `\`${set.identifier}\` ` : ""
            let scores = set?.completedAt ? "Final Score: " : "Score: "
            let toggle = 0
            for (let [slotID, teamID] of Object.entries(set.slots)) {
                let team = event.teams[teamID]
                if (team) {
                    let score = teamID in set.score ? set.score[teamID] : 0
                    let url = `https://smash.gg/tournament/${event.slug.tournament}/event/0/entrant/${team?.id}`
                    teams += `[${team?.name}](${url} '${url}')`
                    scores += `${score}`
                    if (toggle % 2 == 0) {
                        teams += " 🆚 "
                        scores += '-'
                    }
                    i++
                    toggle++
                }
            }

            if (set?.fullRoundText) {
                if (lastRoundText != set.fullRoundText) {
                    this.props.description.push(`__*${set.fullRoundText}*__`)
                }
                lastRoundText = set.fullRoundText
            }

            this.props.description.push(teams)

            if (set?.startedAt) {
                let url = `https://smash.gg/${event.slug.event}/set/${set.id}`
                scores = `[${scores}](${url} '${url}')`
            }

            this.props.description.push(`${scores}`)

            if (set?.startedAt) {
                this.props.description.push(`<t:${set.startedAt}:f>`)
            }

            this.props.description.push("")

            if (i % (5 * 2) == 0) {
                this.pages.push(new VillainsEmbed(this.props))
                this.props.description = ["***Sets***"]
            }
        }
        if (this.pages.length > 0) {
            this.send(message, this.pages)
        }
        this.null = true
    }

    async test(client, message) {
        let dummy = null
        const baseArgs = []
        const varArgs = [
          "3v3-villains-90-rocket-league-tournament",
          "twitch-troopers-splitgate-invitational",
          "trident-50-valorant-tournament",
          "300-bandits-on-wheels-gameworks-x-tactical-banditry-rocket-league-30"
        ]

        for(let added of varArgs) {
            let args = baseArgs.concat([ ...added.split(" ") ])
            dummy = new SmashGGEvent()
            dummy.props.footer.msg = args.join(" | ")
            dummy.run(client, message, args, null, "")
        }
    }
}
