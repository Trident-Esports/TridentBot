const VillainsCommand = require('../../classes/vcommand.class');
const { GraphQLClient } = require('graphql-request');
const fs = require('fs');

module.exports = class SmashGGBracket extends VillainsCommand {
    constructor() {
        let comprops = {
            name: "smashbracket",
            category: "smashgg",
            description: "SmashGG Bracket Listing",
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
        // Get API Key
        const SENSITIVE = JSON.parse(fs.readFileSync("./SENSITIVE.json", "utf8"))

        // Connect to SmashGG API
        const endpoint = "https://api.smash.gg/gql/alpha"
        const GQLClient = new GraphQLClient(endpoint, {
            headers: {
                "Authorization": "Bearer " + SENSITIVE.smashGG.apiKey
            }
        })

        // Get Event ID
        let data = await this.getTournamentBySlug(GQLClient, "3v3-villains-90-rocket-league-tournament")
        const eventID = data.tournament.events[0].id

        // Get Event Standings
        data = await this.getEventStandings(GQLClient, eventID)

        // Start Event Object
        let event = {
          id: data.event.id,
          name: data.event.name,
          teams: {},
          sets: {}
        }
        // Save Team IDs, Names & Placements
        for(let node of data.event.standings.nodes) {
            event.teams[node.entrant.id] = {id: node.entrant.id, name: node.entrant.name, placement: node.placement}
        }

        data = await this.getEventSets(GQLClient, eventID)

        // Save Set IDs, Teams
        for(let node of data.event.sets.nodes) {
            if (!((node.id + "").includes("preview_"))) {
                event.sets[node.id] = {id: node.id}
                event.sets[node.id]["slots"] = {}
                event.sets[node.id]["score"] = {}
                for (let slot of node.slots) {
                    if (slot?.id && slot?.entrant?.id) {
                        event.sets[node.id]["slots"][slot.id.toString()] = slot.entrant.id
                    }
                }
                let set = await this.getSetStats(GQLClient, node.id)
                event.sets[node.id]["completedAt"] = set.set.completedAt
                event.sets[node.id]["startedAt"] = set.set.startedAt
                event.sets[node.id]["state"] = set.set.state
                // console.log(JSON.stringify(set,undefined,2))
                for (let sSlot of set.set.slots) {
                    if (sSlot?.standing?.stats?.score) {
                        let teamID = event.sets[node.id]["slots"][sSlot.id]
                        if (teamID) {
                            event.sets[node.id]["score"][teamID.toString()] = sSlot.standing.stats.score.value
                        }
                    }
                }
            }
        }

        // Print Response
        // console.log(JSON.stringify(data,undefined,2))

        console.log(event)
    }
}
