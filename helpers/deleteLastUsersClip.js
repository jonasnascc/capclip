require("dotenv").config()

const deleteLastUsersClip = async (client,userId) => {
    const {CHANNEL_ID} = process.env
    if(!CHANNEL_ID) return false;

    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        const messages = await channel.messages.fetch({ limit: 50 });

        const lastBotMessage = messages.filter(msg => ((msg.author.id === client.user.id) && msg.content.endsWith(`Enviado por: <@${userId}>`))).first()

        if(lastBotMessage) return await lastBotMessage.delete()
    } catch (error) {
        console.error('Error while fetch or delete messages', error);
        return false;
    }
    return false
}

module.exports = {deleteLastUsersClip}