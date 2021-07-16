const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');
const BotActivityCommand = require('../mod/botactivity');

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const { getPreview } = require("spotify-url-info");

// Sonic CD Open          | .p <https://www.youtube.com/watch?v=EYW7-hNXZlM>
// Sonic CD End           | .p <https://www.youtube.com/watch?v=oGiDJAjJ5Iw>
// Let the Bad Times Roll | .p <https://open.spotify.com/track/6IOL5tW3yRKKKpPNVCVmzU?si=5561f47153294b2a>

const queue = new Map()
module.exports = class PlayCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: 'play',             // songSearch
            aliases: [
                'callbot',            // callBot
                'p',                  // songSearch
                'skip',               // skipSong
                'currentsong',        // showQueue(1)
                'showqueue',          // showQueue
                'stop','clearqueue',  // clearQueue
                'nukebot'             // nukeBot
            ],
            category: 'music',
            description: 'Manages music',
        }
        super(comprops, { caption: { text: "Villains Music" } })
        this.connection = null
        this.song_queue = null
        this.server_queue = null
        this.voice_channel = null
    }

    async action(client, message, cmd) {
        // Pre-Flight Checks
        let preFlightChecks = async (message) => {
            console.log("Music: Pre-Flight Checks")
            // Get voice channel that caller is in
            this.voice_channel = message.member.voice.channel
            if (!this.voice_channel) {
                this.error = true
                this.props.description = 'You need to be in a voice channel to play some music'
            }

            if (!(this.error)) {
                if (!(this.error)) {
                    // Get Bot perms for channel
                    console.log("Music: Checking Bot's Perms")
                    const permissions = this.voice_channel.permissionsFor(message.client.user);
                    if ((!(permissions.has('CONNECT' || 'SPEAK')))) {
                        this.error = true
                        this.props.description = "Bot doesn't have access to the voice channel that you're in"
                    }

                    if(!(this.server_queue)) {
                        this.server_queue = queue.get(message.guild.id)
                    }
                }
            }
        }

        // Call Bot
        let callBot = async (message) => {
            console.log("Music: Calling Bot")
            this.connection = await this.voice_channel.join();

            if(!this.connection) {
                this.error = true
                this.props.description = "Bot couldn't join voice channel"
            }
        }

        // Nuke Bot
        let nukeBot = async (message) => {
            console.log("Music: Nuking Bot")
            await this.voice_channel.leave();
            queue.delete(message.guild.id);
        }

        // Play/Queue Song
        let songPlayer = async (client, message, song) => {
            if (!(this.song_queue)) {
              this.song_queue = queue.get(message.guild.id);
              console.log("Music: Setting Song Queue:",this?.song_queue?.songs ? this.song_queue.songs : "None");
            }

            if (!song) {
                console.log("Music: No Songs left")
                this.error = true;
                this.props.description = "No songs left in queue. Bot leaving voice channel.";

                let activityType = ""
                if (client?.user?.presence?.activities) {
                    if (client.user.presence.activities.length > 0) {
                        activityType = client.user.presence.activities[0].type.toLowerCase()
                    }
                }
                if (activityType != "streaming") {
                    let ba = new BotActivityCommand({ null: true })
                    ba.run(client, message, [])
                }

                // Nuke Bot
                await nukeBot(message)
                this.send(message, new VillainsEmbed(this.props))
                this.null = true
                return;
            }

            console.log("Music: Play Song")

            const stream = ytdl(song.url, {
                filter: 'audioonly'
            });

            this.song_queue.connection.play(stream, {
                seek: 0,
                volume: 1
            })
                .on('finish', () => {
                    console.log("Music: Song Finished");
                    this.song_queue.songs.shift();
                    songPlayer(client, message, this.song_queue.songs[0]);
                }); {
                this.props.description = `Now playing **${song.title}** enjoy`

                let activityType = ""
                if (client?.user?.presence?.activities) {
                    if (client.user.presence.activities.length > 0) {
                        activityType = client.user.presence.activities[0].type.toLowerCase()
                    }
                }
                if (activityType != "streaming") {
                    let ba = new BotActivityCommand({ null: true })
                    ba.run(client, message, [ "listening", song.title ])
                }

                this.send(message, new VillainsEmbed(this.props))
                this.null = true
            }
        }

        // Search for Song
        let songSearch = async (client, message) => {
            console.log("Music: Search for Song")

            if (!(this.error)) {
                let song = {};

                let inputURL = this?.inputData?.args.join(" ").trim().replace("<","").replace(">","")

                // Validate URL as YT URL
                if (ytdl.validateURL(inputURL)) {
                    const songInfo = await ytdl.getInfo(inputURL);
                    song = {
                        title: songInfo.videoDetails.title,
                        url: songInfo.videoDetails.video_url
                    };
                } else if (inputURL.includes('spotify')) {
                    // Check if Spotify
                    const spotifyTrackInfo = await getPreview(inputURL);

                    const videoFinder = async (query) => {
                        const videoResult = await ytSearch(query);
                        return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
                    };

                    const video = await videoFinder(`${spotifyTrackInfo.title} ${spotifyTrackInfo.artist}`);

                    // If we got something, package it
                    if (video) {
                        song = {
                            title: video.title,
                            url: video.url
                        };
                    } else {
                        this.error = true
                        this.props.description = "Error finding song."
                    }
                } else {
                    // Not YT nor Spotify
                    const videoFinder = async (query) => {
                        const videoResult = await ytSearch(query);
                        return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
                    };
                    if (inputURL == "") {
                        this.error = true
                        this.props.description = "No search string given."
                    }
                    if (!(this.error)) {
                        // Get the vid
                        const video = await videoFinder(inputURL);

                        if (video) {
                            song = {
                                title: video.title,
                                url: video.url
                            };
                        } else {
                            this.error = true
                            this.props.description = "Error finding song."
                        }
                    }
                }

                if (!(this.error)) {
                    // If there's no queue
                    if (!(this.server_queue)) {
                      if(this.song_queue) {
                          this.server_queue = this.song_queue;
                      } else {
                          this.server_queue = queue.get(message.guild.id);
                      }
                      console.log("Music: Setting Server Queue:",this?.server_queue?.songs ? this.server_queue.songs : "None");
                    }
                    if (!this.server_queue) {
                        // Make one
                        const queue_constructor = {
                            voice_channel: this.voice_channel,
                            text_channel: message.channel,
                            Connection: null,
                            songs: []
                        }

                        queue.set(message.guild.id, queue_constructor);
                        queue_constructor.songs.push(song);

                        try {
                            await callBot(message);
                            queue_constructor.connection = this.connection;
                            await songPlayer(client, message, queue_constructor.songs[0]);
                        } catch (err) {
                            queue.delete(message.guild.id);
                            this.error = true
                            this.props.description = "There was an Error connecting"
                            throw err;
                        }
                    } else {
                        // We've got a queue, add to it
                        this.server_queue.songs.push(song); {
                            console.log("Music: Queueing Song")
                            this.props.description = `**${song.title}** added to queue`;
                            this.send(message, new VillainsEmbed(this.props));
                            this.null = true
                        }
                    }
                }
            }
        }

        // Skip Song
        let skipSong = async (message) => {
            console.log("Music: Skipping Song")
            if (!message.member.voice.channel) {
                this.error = true
                this.props.description = "You need to be in a voice channel"
            }

            if (!this.server_queue) {
                this.error = true
                this.props.description = "There are no songs in the queue"
            } else {
                this.props.description = "Skipping song";
                this.server_queue.connection.dispatcher.end();
                this.send(message, new VillainsEmbed(this.props));
                this.null = true;
            }
        }

        // Show Queue
        let showQueue = async (message, amount) => {
            console.log("Music: Showing Queue")
            if (!message.member.voice.channel) {
                this.error = true
                this.props.description = "You need to be in a voice channel"
            }

            if (!this.server_queue) {
                this.error = true
                this.props.description = "There are no songs in the queue"
            } else {
                this.props.description = []
                let list = this.server_queue.songs
                if (amount == 1) {
                    list = [ this.server_queue.songs[0] ]
                }
                console.log(list)
                for (let song of list) {
                    if (song) {
                        this.props.description.push(song.title)
                    }
                }
                this.send(message, new VillainsEmbed(this.props));
                this.null = true;
            }
        }

        // Clear Queue
        let clearQueue = async (message) => {
            console.log("Music: Clearing Queue")
            if (!message.member.voice.channel) {
                this.error = true
                this.props.description = "You need to be in a voice channel"
            }

            if (!this.server_queue) {
                this.error = true
                this.props.description = "There are no songs in the queue"
            } else {
                this.props.description = "Dumping queue";
                this.server_queue.songs = [];
                this.server_queue.connection.dispatcher.end();
                this.send(message, new VillainsEmbed(this.props));
                this.null = true;
            }
        }

        // Short circuit if no args
        if (!(this?.inputData?.args)) {
            return;
        }

        if (!(this.error)) {
            await preFlightChecks(message)
            if (["play","p"].indexOf(cmd) > -1) {
                await songSearch(client, message)
            } else if (cmd == "skip") {
                await skipSong(message)
            } else if (cmd == "showqueue" || cmd == "currentsong") {
                await showQueue(message, cmd == "currentsong" ? 1 : -1)
            } else if (cmd == "stop" || cmd == "clearqueue") {
                await clearQueue(message)
            } else if (cmd == "callbot") {
                await callBot(message)
            } else if (cmd == "nukebot") {
                await nukeBot(message)
            }
            if (!(this.error)) {
                message.delete()
                this.null = true
            }
        }
    }
}
