client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const slashCommand = client.slashCommands.get(interaction.commandName);
        if (!slashCommand) return;

        slashCommand.run(client, interaction);
    } else if (interaction.isAutocomplete()) {
        const slashCommand = client.slashCommands.get(interaction.commandName);
        if (!slashCommand || !slashCommand.autocomplete) return;

        slashCommand.autocomplete(client, interaction);
    }
    if (interaction.isButton()) {
        if (interaction.customId == "delete") interaction.message.delete();
    }
});