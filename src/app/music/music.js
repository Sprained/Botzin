const ytdl = require('ytdl-core');

const links = [];
module.exports = {
    async yt(message, args){
        links.push(args);
        console.log(links[0])
        if(links.length === 1){
            tocar(message);
        }
        
    }
}

function tocar(msg){
    const voiceChannel = msg.member.voice.channel
    voiceChannel.join().then(async connection => {
        connection.play(
            ytdl(links[0], { filter: 'audioonly', highWaterMark: 1<<25 }),
            msg.channel.send(`Tocando: ${links[0]}`)
        ).on('finish', () => {
            links.shift();
            if(links.length >= 1){
                tocar(msg)
            }
        });
    })
}