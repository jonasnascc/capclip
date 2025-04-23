require("dotenv").config()

const msgRegex = /^adduser\s([^\s]+)\s([a-zA-Z0-9]+)$/

const loadUsersCodes = async (client) => {
    const { ADM_ID } = process.env;
    if (!ADM_ID) console.error("ADM_ID not found.");
    console.log("Loading users codes")

    const user = await client.users.fetch(ADM_ID);
    if(!user) console.error("Admin user not found.");

    const dmChannel = await user.createDM();

    const messages = await dmChannel.messages.fetch({ limit: 50, filter: m => m.author.id === client.user.id });

    let usersCodes = []
    messages.forEach(message => {
        const match = message.content.match(msgRegex);
        if(match) {
            usersCodes.push({userId: match[1], userCode: match[2]})
        }
    });

    console.log(`Loaded ${usersCodes.length} code${usersCodes.length>1?"s":""}.`)
    return usersCodes
}

module.exports = {loadUsersCodes}