const { activityType, activityName, Status } = require("./botconfig.json")
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
const fs = require("fs");
const { dirname } = require("node:path")
const path = require('path');
const { URL } = require('url');

const { MessageCMDManager } = require("./system/utils/messageCommands.js");
const { SlashManager } = require("./system/utils/slashCommands.js");

const rootPath = dirname(`${path.resolve(__filename)}`);

(async () => {
    global.client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent, // Only for bots with message content intent access.
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildInvites,
        ],
        partials: [Partials.Channel]
    });

    client.config = require("./botconfig.json")
    client.commands = new Collection();
    client.aliases = new Collection();
    client.events = new Collection();
    client.libevents = new Collection();
    client.buttonCommands = new Collection();
    client.selectMenus = new Collection();
    client.modalForms = new Collection();
    client.contextMenus = new Collection();
    client.slashCommands = new Collection();
    client.cache = {};
    client.pixiv = {};
    
    await client.login(client.config.token || process.env.DISCORD_TOKEN);
    await MessageCMDManager(client, __dirname);
    await SlashManager(client, __dirname);
})()

//End
require("./system/ready.js");
require("./system/messageCreate.js");
require("./system/interactionCreate.js");