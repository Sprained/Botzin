require('dotenv/config');
const Discord = require('discord.js');
const http = require('http');

const client = new Discord.Client();

const config = require('./config.json');

const { bot } = require('./app/message/commands');
const { yt } = require('./app/music/music');

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

//servidor
const server = http.createServer((req, res) => {
    respondToRequest(req, res);
});

server.listen(port, hostname, () => {
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
});

//quando bot iniciar em um servidor
client.on('ready', () => {
    console.log(`O bot foi iniciado, com ${client.users.cache.size} usúarios e em ${client.guilds.cache.size} servidores`);
    client.user.setActivity('::bot', { type: 'LISTENING' }); (`Eu estou em ${client.guilds.cache.size} servidores`);
});

//filtrar menssagens dos usuarios e fazer escolha do comando
client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type == 'dm') return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const comando = args.shift().toLowerCase();
    

    switch(comando){
        case 'bot':
            bot(message);
            break;
        case 'play':
            yt(message, args[0])
            break
    }
});

client.login(process.env.DISCORD_TOKEN);