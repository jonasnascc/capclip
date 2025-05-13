require("dotenv").config()
const crypto = require("crypto")


const generateUserHash = (login, password) => {
    const secret = process.env.HASH_SECRET;
    return crypto
        .createHmac('sha256', secret)
        .update(`${login}:${password}`)
        .digest('hex');
}

const findUserByDMHash = async (hash, client) => {
    const dmChannels = client.channels.cache.filter(ch => ch.type === 'DM');
    for (const [id, channel] of dmChannels) {
        try {
            const messages = await channel.messages.fetch({ limit: 5 });

            for(let msg of messages.values()){
                const msgHash = msg.content.trim()
                if(hash === msgHash) {
                    return msg.author.id
                }
            }

            console.log('---------------------');
        } catch (err) {
            console.error(`Erro ao buscar mensagens da DM ${id}:`, err.message);
        }
    }
    return null
}

module.exports = {
    generateUserHash,
    findUserByDMHash
}