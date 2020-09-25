//Mensagem em chat relacionados a requisiçãos de comandos
module.exports = {
    async bot(message){
        message.channel.send(`${message.author}, olá!\nLista de Comandos:\n\n::play {link youtube} - Toca uma musica\nAgora consigo tocar mais de uma musica, fazer uma fila de musica :D`)
    }
}