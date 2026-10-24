const { activityType, activityName, Status } = require("../botconfig.json")
const Discord = require("discord.js");
const { format } = require("util")

client.on("ready", async () => {
    console.log(`${client.user.username} is online on ${client.guilds.cache.size} servers!`);
    client.user.setActivity({
        "state": "Life is beautiful but you're an Indonesian citizen",
        "name": ",eval | Debug Mode",
        "type": 0
    })
})
