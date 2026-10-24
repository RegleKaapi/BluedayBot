const { format } = require('util');

client.on("messageCreate", async(message) => {
        if (!message || message.author?.bot)
            return;

        const content = message.content || "";
        
        // Auto-run Instagram downloader on link detection
        if (content.startsWith("https://") && /ins/gi.test(content)) {
            const igCmd = client.commands.get("instagram");
            if (igCmd)
                igCmd.run(client, message, content.split(" "));
        }
        
        // 2. Determine active prefix
        const prefixes = Array.isArray(global.PREFIX) ? global.PREFIX : [global.PREFIX || client.config?.prefix || ","];
        const prefix = prefixes.find(p => content.startsWith(p));
        if (!prefix)
            return;
            
        // Extract command name and args
        const args = content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName)
            return;
            
        // 3. Find command by name or alias
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command)
            return;
        
        const text = args.join(' ').trim();
        const extra = {
            message,
            args,
            text,
            commandName
        };
        try {
        // Check DM restrictions
            if (!message.guild && !command.allowInDms)
                return;
            
            await message.channel.sendTyping().catch(() => {});
            await command.run(client, message, args, text, extra);
            
        } catch (e) {
            console.error("Command Execution Error:", e);
            const formattedError = format(e);
            await message.reply(
                {
                    content: `\`\`\`js\n${e}\n\`\`\``,
                    allowedMentions: {
                        repliedUser: false
                    }
                }
            ).catch(() => {});
        }
    }
);