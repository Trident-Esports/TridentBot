const VillainsCommand = require('../../classes/vcommand.class');
const VillainsEmbed = require('../../classes/vembed.class');
const BotActivityCommand = require('../mod/botactivity');
const { DiscordAPIError } = require('discord.js');

//TODO: Spotify Playlists
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ytSearch = require('yt-search');

const { getPreview } = require("spotify-url-info");

// Sonic CD Open            | vln p <https://www.youtube.com/watch?v=EYW7-hNXZlM>
// Sonic CD End             | vln p <https://www.youtube.com/watch?v=oGiDJAjJ5Iw>
// Let the Bad Times Roll   | vln p <https://open.spotify.com/track/6IOL5tW3yRKKKpPNVCVmzU?si=5561f47153294b2a>
// Kingdom Hearts Playlist  | vln p <https://www.youtube.com/playlist?list=PLrk5ekL2Y-u9ERXjjoDXD57ajaXFNzSYy>
// Hero of Rhyme Playlist   | vln p <https://www.youtube.com/playlist?list=PLrk5ekL2Y-u-uAIRJQ1HXPWqBa_jRkcNK>

const queue = new Map()
module.exports = class PlayCommand extends VillainsCommand {
    constructor() {
        let comprops = {
            name: 'play',             // songSearch
            aliases: [
                'callbot',            // callBot
                'p',                  // songSearch
                'skip', 'next',       // skipSong
                'jump',               // jumpSong
                'currentsong',        // showQueue(1)
                'showqueue', 'q',     // showQueue
                'stop','clearqueue',  // clearQueue
                'wherebot',           // whereBot
                'nukebot', 'leave',   // nukeBot
                'cyclebot'            // cycleBot
            ],
            category: 'music',
            description: 'Manages music',
        }
        super(comprops, { caption: { text: "Villains Music" } })
        this.connection = null
        this.song_queue = null
        this.now_playing = null
        this.server_queue = null
        this.voice_channel = null
    }

    async action(client, message, cmd) {
        // Pre-Flight Checks
        // Call Bot
        // Nuke Bot
        // Where Bot
        // Play/Queue Song
        // Search for Song
        // Skip Song
        // Jump to Song
        // Show Queue
        // Clear Queue

        // Pre-Flight Checks
        let preFlightChecks = async (message) => {
            console.log("Music: Pre-Flight Checks")
            // Get voice channel that caller is in
            this.voice_channel = message.member.voice.channel
            if (!this.voice_channel) {
                this.error = true
                this.props.description = 'You need to be connected to a voice channel to play music.'
            }

            if (!(this.error)) {
                // Get Bot perms for channel
                console.log("Music: Checking Bot's Perms")
                const permissions = this.voice_channel.permissionsFor(message.client.user);
                if ((!(permissions.has('CONNECT' || 'SPEAK')))) {
                    this.error = true
                    this.props.description = `<@${client.user.id}> doesn't have permission to join the voice channel that you're in.`
                    console.log("Music: !!! Bot doesn't have perms to channel !!!")
                }

                if(!(this.server_queue)) {
                    this.server_queue = queue.get(message.guild.id)

                    console.log("Music: Setting Server Queue:",this?.server_queue?.songs ? this.server_queue.songs.length : "None");
                }
            }
        }

        // Call Bot
        let callBot = async (message) => {
            console.log("Music: Calling Bot")
            this.connection = await this.voice_channel.join();

            if(!this.connection) {
                this.error = true
                this.props.description = "Bot couldn't join voice channel."
            }
        }

        // Nuke Bot
        let nukeBot = async (message) => {
            console.log("Music: Nuking Bot")
            await this.voice_channel.leave();
            queue.delete(message.guild.id);
        }

        // Where Bot
        let whereBot = async(client, message) => {
            this.props.description = []
            for (let [connectionID, connection] of client.voice.connections.entries()) {
                this.props.description.push(`<#${connection.channel.id}>`)
                console.log(`${connection.channel.name} (ID:${connection.channel.id})`)
            }
            await this.send(message, new VillainsEmbed(this.props))
            this.null = true
        }

        // Play/Queue Song
        let songPlayer = async (client, message, song) => {
            if (!(this.song_queue)) {
              this.song_queue = queue.get(message.guild.id);

              console.log("Music: Setting Song Queue:",this?.song_queue?.songs ? this.song_queue.songs.length : "None");
            }

            if (!song) {
                console.log("Music: No Songs left")
                this.error = true;
                this.props.description = `No songs left in queue. <@${client.user.id}> leaving voice channel.`;

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
                await this.send(message, new VillainsEmbed(this.props))
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
                this.props.description = `Now playing **${song.title}**, enjoy!` + ((song?.user) ? ` [*<@${song.user.id}>*] ` : "")

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

                if (this.now_playing && (!(this.now_playing.deleted))) {
                    this.now_playing.delete()
                }
                this.now_playing = await this.send(message, new VillainsEmbed(this.props))
                this.null = true
            }
        }

        // Search for Song
        let songSearch = async (client, message, inputURL) => {
            console.log("Music: Search for Song")

            if (!(this.error)) {
                let song = {};

                let silent = false;

                if (!inputURL) {
                    inputURL = this?.inputData?.args.join(" ").trim().replace("<","").replace(">","")
                } else {
                    silent = true;
                }

                let user = {
                    username: message.author.username,
                    discriminator: message.author.discriminator,
                    avatar: message.author.displayAvatarURL({ format: "png", dynamic: true }),
                    id: message.author.id
                }

                // Validate URL as YT URL
                if (ytdl.validateURL(inputURL)) {
                    const songInfo = await ytdl.getInfo(inputURL);
                    song = {
                        title: songInfo.videoDetails.title,
                        url: songInfo.videoDetails.video_url,
                        user: user
                    };
                } else if (inputURL.includes('youtu') && inputURL.includes('be') && inputURL.includes('playlist')) {
                    const playlistInfo = await ytpl(inputURL);

                    this.props.description = `Playlist **${playlistInfo.title}** added to queue by` + ` [*<@${message.author.id}>*] `
                    await this.send(message, new VillainsEmbed(this.props));
                    this.null = true;

                    let success = false;
                    for (let [, songInfo] of Object.entries(playlistInfo.items)) {
                        if (songInfo?.url && songInfo.url != "") {
                            success = await songSearch(client, message, songInfo.shortUrl) || false;
                        }
                    }
                    if (!success) {
                        this.null = true;
                    }
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
                            url: video.url,
                            user: user
                        };
                    } else {
                        this.error = true
                        this.props.description = "Couldn't find Spotify song on YouTube."
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
                                url: video.url,
                                user: user
                            };
                        } else {
                            this.error = true
                            this.props.description = "Error finding song."
                        }
                    }
                }

                // Sanity check
                if ((!(this.error)) && song && song?.title) {
                    // If there's no queue
                    if (!(this.server_queue)) {
                      if(this.song_queue) {
                          this.server_queue = this.song_queue;
                      } else {
                          this.server_queue = queue.get(message.guild.id);
                      }

                      console.log("Music: Setting Server Queue:",this?.server_queue?.songs ? this.server_queue.songs.length : "None");
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
                            if (!silent && song?.title) {
                                this.props.description = `Song **${song.title}** added to queue by` + ((song?.user) ? ` [*<@${song.user.id}>*] ` : "");
                                await this.send(message, new VillainsEmbed(this.props));
                            }
                            this.null = true
                            return true
                        }
                    }
                }
            }
            return false
        }

        // Skip Song
        let skipSong = async (message, silent = true) => {
            console.log("Music: Skipping Song")
            if (!message.member.voice.channel) {
                this.error = true
                this.props.description = "You need to be connected to a voice channel to skip songs."
            }

            if (!this.server_queue) {
                this.error = true
                this.props.description = "There are no songs in the queue."
            } else {
                await this.server_queue.connection.dispatcher.end();
                if (!silent) {
                    this.props.description = "Skipping song";
                    await this.send(message, new VillainsEmbed(this.props));
                    this.null = true;
                }
            }
        }

        // Jump to song in Queue
        let jumpSong = async (message) => {
            let jumpNum = this.inputData.args[0]
            console.log("Jump Song:",jumpNum)
            console.log("Pre Queue:",this?.server_queue?.songs ? this.server_queue.songs.length : "None")
            if (parseInt(jumpNum) > 2) {
                this.server_queue.songs = this.server_queue.songs.slice(parseInt(jumpNum) - 2)
                console.log("Post Queue:",this?.server_queue?.songs ? this.server_queue.songs.length : "None")
                await skipSong(message)
            } else if (parseInt(jumpNum) == 2) {
                await skipSong(message)
            }
            this.null = true
        }

        // Show Queue
        let showQueue = async (message, amount) => {
            console.log("Music: Showing Queue")
            if (!this.server_queue) {
                this.error = true
                this.props.description = "There are no songs in the queue."
            } else {
                let list = this.server_queue.songs
                if (amount == 1) {
                    list = [ this.server_queue.songs[0] ]
                }

                let thisqueue = []
                for (let [idx, song] of list.entries()) {
                    if (song) {
                        thisqueue.push(`\`${idx + 1}. ${song.title} \`` + ((song?.user) ? ` [*<@${song.user.id}>*] ` : ""))
                    }
                    if ((idx  > 0) && ((idx + 1) % 10 == 0)) {
                        this.props.description = thisqueue.join("\n\n")
                        this.pages.push(new VillainsEmbed(this.props))
                        thisqueue = []
                    }
                }
                if (thisqueue.length > 0) {
                    this.props.description = thisqueue.join("\n\n")
                    this.pages.push(new VillainsEmbed(this.props))
                    thisqueue = []
                }

                await this.send(message, this.pages);
                this.null = true;
            }
        }

        // Clear Queue
        let clearQueue = async (message) => {
            console.log("Music: Clearing Queue")
            if (!message.member.voice.channel) {
                this.error = true
                this.props.description = "You need to be connected to a voice channel to clear the queue."
            }

            if (!this.server_queue) {
                this.error = true
                this.props.description = "There are no songs in the queue."
            } else {
                this.props.description = "Dumping the queue.";
                this.server_queue.songs = [];
                await this.server_queue.connection.dispatcher.end();
                await this.send(message, new VillainsEmbed(this.props));
                this.null = true;
            }
        }

        // Short circuit if no args
        if (!(this?.inputData?.args)) {
            return;
        }

        if (!(this.error)) {
            if (cmd == "wherebot") {
                // Where Bot
                await whereBot(client, message)
            } else {
                await preFlightChecks(message)

                if(!(this.error)) {
                    if (["play", "p"].includes(cmd)) {
                        // Search/Enqueue
                        await songSearch(client, message)
                    } else if (["skip", "next"].includes(cmd)) {
                        // Skip
                        await skipSong(message)
                    } else if (cmd == "jump") {
                        // Jump to Song
                        await jumpSong(message)
                    } else if (["showqueue", "q", "currentsong"].includes(cmd)) {
                        // Show Queue/Current Song
                        await showQueue(message, cmd == "currentsong" ? 1 : -1)
                    } else if (["stop", "clearqueue"].includes(cmd)) {
                        // Clear Queue
                        await clearQueue(message)
                    } else if (cmd == "callbot") {
                        // Call Bot
                        await callBot(message)
                    } else if (["nukebot", "leave"].includes(cmd)) {
                        // Nuke Bot
                        await nukeBot(message)
                    } else if (cmd == "cyclebot") {
                        // Cycle Bot
                        await nukeBot(message)
                        await callBot(message)
                    }
                }
            }
            if (!(this.error)) {
                if (!(message.deleted)) {
                    try {
                        await message.delete()
                        this.null = true
                    } catch (e) {
                        if (e instanceof DiscordAPIError) {
                            if (e.httpStatus === 404) {
                                console.log("Music: Message already deleted. Ignoring.")
                            }
                        }
                    }
                }
            }
        }
    }
}
