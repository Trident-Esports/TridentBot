const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');
const BotActivityCommand = require('../mod/botactivity');

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const { getPreview } = require("spotify-url-info");

// Sonic CD Open          | .p <https://www.youtube.com/watch?v=EYW7-hNXZlM>
// Sonic CD End           | .p <https://www.youtube.com/watch?v=oGiDJAjJ5Iw>
// Let the Bad Times Roll | .p <https://open.spotify.com/track/6IOL5tW3yRKKKpPNVCVmzU?si=5561f47153294b2a>

module.exports = class PlayCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: 'play',
            aliases: ['p','stop','skip','clearqueue','callbot','nukebot'],
            category: 'music',
            description: 'Manages music',
        }
        super(comprops, { caption: { text: "Villains Music" } })
        this.queue = new Map()
        this.song_queue = null
        this.server_queue = null
        this.voice_channel = null
    }

    async action(client, message, cmd) {
        // Call Bot
        let callBot = async (message) => {
            console.log("Music: Calling Bot")
            // Get voice channel that caller is in
            this.voice_channel = message.member.voice.channel
            if (!this.voice_channel) {
                this.error = true
                this.props.description = 'You need to be in a voice channel to play some music'
            }

            if (!(this.error)) {
                const connection = await this.voice_channel.join();

                if(!connection) {
                    this.error = true
                    this.props.description = "Bot couldn't join voice channel"
                }

                if (!(this.error)) {
                    // Get Bot perms for channel
                    console.log("Music: Checking Bot's Perms")
                    const permissions = this.voice_channel.permissionsFor(message.client.user);
                    if ((!(permissions.has('CONNECT' || 'SPEAK')))) {
                        this.error = true
                        this.props.description = "Bot doesn't have access to the voice channel that you're in"
                    }
                    return connection
                }
            }
            return null
        }

        // Nuke Bot
        let nukeBot = async (message) => {
            console.log("Music: Nuking Bot")
            this.song_queue.voice_channel.leave();
            this.queue.delete(message.guild.id);
        }

        // Play/Queue Song
        let songPlayer = async (client, message, song) => {
            console.log("Music: Play Song")

            if (!(this.song_queue)) {
              this.song_queue = this.queue.get(message.guild.id);
              console.log("Music: Getting Song Queue:",this?.song_queue?.songs ? this.song_queue.songs : "None");
            }

            if (!song) {
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
        let playSong = async (client, message) => {
            console.log("Music: Search for Song")

            if (!(this.error)) {
                // Get queue
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
                    if (!this.server_queue) {
                        // Make one
                        const queue_constructor = {
                            voice_channel: this.voice_channel,
                            text_channel: message.channel,
                            Connection: null,
                            songs: []
                        }

                        this.queue.set(message.guild.id, queue_constructor);
                        queue_constructor.songs.push(song);

                        try {
                            queue_constructor.connection = await callBot(message);
                            await songPlayer(client, message, queue_constructor.songs[0]);
                        } catch (err) {
                            this.queue.delete(message.guild.id);
                            this.error = true
                            this.props.description = "There was an Error connecting"
                            throw err;
                        }
                    } else {
                        // We've got a queue, add to it
                        this.server_queue.songs.push(song); {
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
            await callBot(message)
            if (!(this.server_queue)) {
              // this.server_queue = this.queue.get(message.guild.id);
              this.server_queue = this.song_queue
              console.log("Music: Getting Server Queue:",this?.server_queue ? this.server_queue : "None")
            }
            if (["play","p"].indexOf(cmd) > -1) {
                await playSong(client, message)
            } else if (cmd == "skip") {
                await skipSong(message)
            } else if (cmd == "stop" || cmd == "clearqueue") {
                await clearQueue(message)
            } else if (cmd == "callbot") {
                // do nothing
            } else if (cmd == "nukebot") {
                await nukeBot(message)
            }
            if (!(this.error)) {
                this.null = true
            }
        }
    }
}
