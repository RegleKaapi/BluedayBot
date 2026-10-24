const { fileReader } = require("../fileReader.js");
const fs = require('fs');
const { format } = require('util');
const syntaxerror = require('syntax-error');

const file = __filename;

module.exports.MessageCMDManager = async (client, rootPath) => {
    const messageCommandsFiles = fileReader(`${rootPath}/src/commands`);
    if (!messageCommandsFiles.length) return;

    for (const messageCommandFile of messageCommandsFiles) {
        let name = messageCommandFile.split("commands/")[1];
        try {
            const messageCommand = (require(messageCommandFile)?.MsgCommand);
            if (!messageCommand) continue;

            if (!messageCommand.ignore && messageCommand.name) {
                client.commands.set(messageCommand.name.toLowerCase(), messageCommand);
            }
            /*if (!messageCommand.ignore && messageCommand.aliases && Array.isArray(messageCommand.aliases)) messageCommand.aliases.forEach((messageCommandAlias) => {
                client.aliases.set(messageCommandAlias, messageCommand.name)
            })*/
            client.cache.endPlugin = name;
            if (messageCommand.name) {
                //client.cache.cmdFileDiscord[name] = messageCommand.name?.toLowerCase();
            }
        } catch (e) {
            let err = syntaxerror(fs.readFileSync(messageCommandFile), name, {
                sourceType: 'module',
                allowAwaitOutsideFunction: true
            });
            console.log(`error command ${client.cache?.endPlugin || name}\n${err || e}`);
        }
    }

    client.commands.delete(undefined);
    //client.aliases.delete(undefined)
    console.log("Reload commands success");
};