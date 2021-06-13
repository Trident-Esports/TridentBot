const fs = require('fs');

const ytdl = require('ytdl-core');

const ytSearch = require('yt-search');

const {
    MessageEmbed
} = require('discord.js');

var {
    getData,
    getPreview
} = require("spotify-url-info");

const queue = new Map();

let GLOBALS = JSON.parse(fs.readFileSync("PROFILE.json", "utf8"))
let defaults = JSON.parse(fs.readFileSync("dbs/defaults.json", "utf8"))
let DEV = GLOBALS.DEV;

let stripe = defaults["stripe"]

let props = {
    "title": "***Villains Music***",
    "url": "https://discord.com/KKYdRbZcPT"
}

switch (stripe) {
    default:
        stripe = "#B2EE17";
        break;
}

// Hack in my stuff to differentiate
if (DEV) {
    stripe = GLOBALS["stripe"]
    defaults.footer = GLOBALS.footer
}

props["stripe"] = stripe

const embed = new MessageEmbed()
    .setColor(props.stripe)
    .setTitle(props.title)
    .setURL(props.url)
    .setThumbnail(defaults.thumbnail)
    .setFooter(defaults.footer.msg, defaults.footer.image)
    .setTimestamp()

module.exports = {
    name: 'play',
    aliases: ['skip', 'stop', 'p'],
    desc: 'Music Bot',
    async execute(message, args, cmd, client) {

        const voice_channel = message.member.voice.channel;
        if (!voice_channel) {
            embed.setDescription('You need to be in a voice channel to play some music')
            return message.channel.send(embed);
        }
        const permissions = voice_channel.permissionsFor(message.client.user);
        if(
            (!permissions.has('CONNECT')) ||
            (!permissions.has('SPEAK'))
          ) {
            embed.setDescription('You dont have access to this channel')
            return message.channel.send(embed);
        }

        const server_queue = queue.get(message.guild.id);

        if (cmd === 'play' || 'p') {

            if (cmd === 'skip') skip_song(message, server_queue, embed);
            if (cmd === 'stop') stop_song(message, server_queue, embed);

            if (!args.length) {
                return;
            }
            let song = {};

            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = {
                    title: song_info.videoDetails.title,
                    url: song_info.videoDetails.video_url
                }
            }
            if (ytdl.validateURL(args[0])) {
                const songInfo = await ytdl.getInfo(args[0]);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url
                };
            } else if (args[0].includes('spotify')) {
                const spotifyTrackInfo = await getPreview(args[0]);

                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
                };

                const video = await videoFinder(`${spotifyTrackInfo.title} ${spotifyTrackInfo.artist}`);

                if (video) {
                    song = {
                        title: video.title,
                        url: video.url
                    };
                } else {
                    message.reply('Error finding song.');
                }
            } else {
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
                };
                const video = await videoFinder(args.join(''));

                if (video) {
                    song = {
                        title: video.title,
                        url: video.url
                    };
                } else {
                    message.reply('Error finding song.');
                }
            }
            if (!server_queue) {

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
                    message.channel.send('There was an error connecting');
                    throw err;
                }
            } else {
                server_queue.songs.push(song); {
                    embed.setDescription(`**${song.title}** added to queue`)
                    return message.channel.send(embed);
                }
            }
        }
    }

}


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
        embed.setDescription(`Now playing ** ${song.title} ** enjoy`)
        await song_queue.text_channel.send(embed)
    }

}

const skip_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel');
    if (!server_queue) {
        return message.channel.send('There are no songs in queue');
    }
    server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}
