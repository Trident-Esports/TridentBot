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
        this.server_queue = null
        this.voice_channel = null
    }

    // Call bot to voice channel
    async callBot(message) {
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
                // Get perms for channel
                const permissions = this.voice_channel.permissionsFor(message.client.user);
                if ((!(permissions.has('CONNECT' || 'SPEAK')))) {
                    this.error = true
                    this.props.description = "Bot doesn't have access to the voice channel that you're in"
                }
            }
            return connection
        }
        return null
    }

    // Nuke Bot
    async nukeBot(message) {
        // Doesn't work
        // this.song_queue = this.queue.get(message.guild.id);
        // this.song_queue.voice_channel.leave();
        // this.queue.delete(message.guild.id);
    }

    // Song Player
    async songPlayer(client, message, song) {
        this.song_queue = this.queue.get(message.guild.id);

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
                let ba = new BotActivityCommand().run(client, message, [])
            }

            // Nuke Bot
            this.song_queue.voice_channel.leave();
            this.queue.delete(message.guild.id);
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
                this.song_queue.songs.shift();
                this.songPlayer(client, message, this.song_queue.songs[0]);
            }); {
            this.props.description = `Now playing **${song.title}** enjoy`

            let activityType = ""
            if (client?.user?.presence?.activities) {
                if (client.user.presence.activities.length > 0) {
                    activityType = client.user.presence.activities[0].type.toLowerCase()
                }
            }
            if (activityType != "streaming") {
                let ba = new BotActivityCommand().run(client, message, [ "listening", song.title ])
            }

            this.send(message, new VillainsEmbed(this.props))
            this.null = true
        }
    }

    // Locate, queue, play song
    async playSong(client, message) {
        this.callBot(message)

        if (!(this.error)) {
            // Get queue
            this.server_queue = this.queue.get(message.guild.id);
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
                        queue_constructor.connection = await this.callBot(message);
                        await this.songPlayer(client, message, queue_constructor.songs[0]);
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
    async skipSong(message) {
        if (!message.member.voice.channel) {
            this.error = true
            this.props.description = "You need to be in a voice channel"
        }

        this.server_queue = this.queue.get(message.guild.id);
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
    async clearQueue(message) {
        if (!message.member.voice.channel) {
            this.error = true
            this.props.description = "You need to be in a voice channel"
        }

        this.server_queue = this.queue.get(message.guild.id);
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

    async action(client, message, cmd) {
        // Short circuit if no args
        if (!(this?.inputData?.args)) {
            return;
        }

        if (!(this.error)) {
            if (["play","p"].indexOf(cmd) > -1) {
                this.playSong(client, message)
            } else if (cmd == "skip") {
                this.skipSong(message)
            } else if (cmd == "stop" || cmd == "clearqueue") {
                this.clearQueue(message)
            } else if (cmd == "callbot") {
                this.callBot(message)
            } else if (cmd == "nukebot") {
                this.nukeBot(message)
            }
            if (!(this.error)) {
                this.null = true
            }
        }
    }
}
