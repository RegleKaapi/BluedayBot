const { ApplicationCommandType, REST, Routes } = require("discord.js");
const { fileReader } = require("../fileReader.js");

module.exports.SlashManager = async(client, rootPath) => {
    const allSlashCommandsFiles = fileReader(`${rootPath}/src/slashCommands`);
    const rest = new REST({ version: '10' }).setToken(client.token);

    const guildCommandsObject = {};
    const globalCommandsArray = [];

    if (allSlashCommandsFiles.length > 0) {
        for (const slashCommandFile of allSlashCommandsFiles) {
            const slashCommand = (await import(`file:///${slashCommandFile}`))?.Slash;

            if (!slashCommand) continue;
            if (slashCommand.ignore || !slashCommand.name || !slashCommand.description) continue;

            client.slashCommands?.set(slashCommand.name, slashCommand);

            if (slashCommand.guilds && Array.isArray(slashCommand.guilds)) {
                for (const guild of slashCommand.guilds) {
                    if (!guildCommandsObject[guild]) guildCommandsObject[guild] = [];
                    guildCommandsObject[guild].push({
                        name: slashCommand.name,
                        nsfw: slashCommand.nsfw ?? false,
                        description: slashCommand.description,
                        type: ApplicationCommandType.ChatInput,
                        options: slashCommand.options ?? []
                    });
                };
            }
            else globalCommandsArray.push({
                name: slashCommand.name,
                nsfw: slashCommand.nsfw ?? false,
                description: slashCommand.description,
                type: ApplicationCommandType.ChatInput,
                options: slashCommand.options ?? []
            });
        };
    };

    try {
        // ✅ Change client.application.id to client.user.id
        await rest.put(Routes.applicationCommands(client.application.id), {
            body: globalCommandsArray
        });

        for (const guildObject of Object.entries(guildCommandsObject)) {
            await rest.put(Routes.applicationGuildCommands(client.user.id, guildObject[0]), {
                body: guildObject[1]
            });
        };
    } catch (error) {
        console.log(error);
    };
};