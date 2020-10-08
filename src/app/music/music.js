require('dotenv/config');
const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');

const youtube = new Youtube(process.env.YOUTUBE_TOKEN);

const links = [];
let dispatcher;
module.exports = {
    async yt(message, args) {
        if (ytdl.validateURL(args)) {
            links.push(args);
            if (links.length === 1) {
                tocar(message);
            }
        } else {
            youtube.searchVideos(args, 1).then(async resp => {
                // console.log(resp);
                let video = await youtube.getVideoByID(resp[0].id);
                links.push(`https://www.youtube.com/watch?v=${video.id}`);
                if (links.length === 1) {
                    tocar(message);
                }
            }).catch(err => {
                console.log(err)
            })
        }
    },
    async pause(message) {
        const voiceChannel = await message.member.voice.channel
        //verificar se usuario se encontra no canal de voz
        if (!(await voiceChannel)) {
            return message.channel.send('Precisa ta escutando a musica para pausar ela ne??');
        }

        //verificar se bot se encontra tocando alguma musica
        if (!dispatcher) {
            return message.channel.send('Nem estou tocando uma musica ;-;');
        }

        //verificar se a musica ja esta pausada
        if (dispatcher.paused) {
            return message.channel.send('Musica ja esta pausada!')
        }

        await dispatcher.pause();
    },
    async resume(message) {
        const voiceChannel = await message.member.voice.channel
        //verificar se usuario se encontra no canal de voz
        if (!(await voiceChannel)) {
            return message.channel.send('Precisa ta escutando a musica para pausar ela ne??');
        }

        //verificar se bot se encontra tocando alguma musica
        if (!dispatcher) {
            return message.channel.send('Nem estou tocando uma musica ;-;');
        }

        //verificar se a musica ja esta tocando
        if (!dispatcher.paused) {
            return message.channel.send('Musica não esta pausada!')
        }

        await dispatcher.resume();
    },
    async stop(message) {
        const voiceChannel = await message.member.voice.channel
        //verificar se usuario se encontra no canal de voz
        if (!(await voiceChannel)) {
            return message.channel.send('Precisa ta escutando a musica para cancelar ela ne??');
        }

        //verificar se bot se encontra tocando alguma musica
        if (!dispatcher) {
            return message.channel.send('Nem estou tocando uma musica ;-;');
        }

        await dispatcher.end();
        while (links.length > 0) {
            links.shift();
        }
    },
    async skip(message) {
        const voiceChannel = await message.member.voice.channel
        //verificar se usuario se encontra no canal de voz
        if (!(await voiceChannel)) {
            return message.channel.send('Precisa ta escutando a musica para cancelar ela ne??');
        }

        //verificar se bot se encontra tocando alguma musica
        if (!dispatcher) {
            return message.channel.send('Nem estou tocando uma musica ;-;');
        }

        if (links.length <= 1) {
            return message.channel.send('Tenho nenhuma musica na fila!');
        }

        await dispatcher.end()
        links.shift();
        if (links.length >= 1) {
            tocar(message);
        }
    }
}

function tocar(msg) {
    const voiceChannel = msg.member.voice.channel
    voiceChannel.join().then(async connection => {
        dispatcher = connection.play(
            ytdl(links[0], { filter: 'audioonly', highWaterMark: 1 << 25 }),
            msg.channel.send(`Tocando: ${links[0]}`)
        ).on('finish', () => {
            links.shift();
            if (links.length >= 1) {
                tocar(msg)
            }
        });
    })
}