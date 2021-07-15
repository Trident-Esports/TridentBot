const VillainsCommand = require('../../classes/vcommand.class');

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

var {
    getData,
    getPreview
} = require("spotify-url-info");

const queue = new Map();

module.exports = class PlayCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: 'play',
            aliases: ['p'],
            category: 'music',
            description: 'Plays music',
        }
        super(comprops, { caption: { text: "Villains Music" } })
    }

    async action(client, message) {

        // Short circuit if no args
        if (!(this?.inputData?.args)) {
            return;
        }

        // Get voice channel that caller is in
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) {
            this.error = true
            this.props.description = 'You need to be in a voice channel to play some music'
        }

        if (!(this.error)) {
            // Get perms for channel
            const permissions = voice_channel.permissionsFor(message.client.user);
            if ((!(permissions.has('CONNECT' || 'SPEAK')))) {
                this.error = true
                this.props.description = 'You dont have access to this channel'
            }

            const server_queue = queue.get(message.guild.id);

            const video_player = async (guild, song) => {
                const song_queue = queue.get(guild.id);

                if (!song) {
                    song_queue.voice_channel.leave();
                    queue.delete(guild.id);
                    return;
                }

                const stream = ytdl(song.url, {
                    filter: 'audioonly'
                });

                song_queue.connection.play(stream, {
                    seek: 0,
                    volume: 1
                })
                    .on('finish', () => {
                        song_queue.songs.shift();
                        video_player(guild, song_queue.songs[0]);
                    }); {
                    this.props.description = `Now playing ** ${song.title} ** enjoy`
                }
            }

            let song = {};

            // Validate URL as YT URL
            if (ytdl.validateURL(this?.inputData?.args[0])) {
                const songInfo = await ytdl.getInfo(this?.inputData?.args[0]);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url
                };
            } else if (this?.inputData?.args[0].includes('spotify')) {
                // Check if Spotify
                const spotifyTrackInfo = await getPreview(this?.inputData?.args[0]);

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
                if (this?.inputData?.args.join("").trim() == "") {
                    this.error = true
                    this.props.description = "No search string given."
                }
                if (!(this.error)) {
                    // Get the vid
                    const video = await videoFinder(this?.inputData?.args.join(''));

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
                if (!server_queue) {
                    // Make one
                    const queue_constructor = {
                        voice_channel: voice_channel,
                        text_channel: message.channel,
                        Connection: null,
                        songs: []
                    }

                    queue.set(message.guild.id, queue_constructor);
                    queue_constructor.songs.push(song);

                    try {
                        const connection = await voice_channel.join();
                        queue_constructor.connection = connection;
                        video_player(message.guild, queue_constructor.songs[0]);
                    } catch (err) {
                        queue.delete(message.guild.id);
                        this.error = true
                        this.props.description = "There was an Error connecting"
                        throw err;
                    }
                } else {
                    // We've got a queue, add to it
                    server_queue.songs.push(song); {
                        this.props.description = `**${song.title}** added to queue`
                    }
                }
            }
        }
    }
}
