module.exports = {
    async leave(message) {
        const voiceChannel = await message.member.voice.channel
        await voiceChannel.leave();
        message.channel.send('Adeus humanos ;--;');
    }
}