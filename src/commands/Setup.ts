import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import DiscordClient from "../classes/DiscordClient";

class SetupCommand extends Command {
    name: string = "setup";

    async execute(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const guildId = interaction.guildId
        const channelId = interaction.channelId
        
        if (!guildId) {
            await interaction.reply("Cette commande doit être exécutée dans un salon...")
            return
        }

        await client.services.registeredChannel.set(guildId, channelId)
        await interaction.reply("Salon setup avec succès")
    }
}

export default new SetupCommand()