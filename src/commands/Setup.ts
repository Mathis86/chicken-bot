import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import DiscordClient from "../classes/DiscordClient";

export default class SetupCommand extends Command {
    name: string = "setup";

    async execute(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const guildId = interaction.guildId
        const channelId = interaction.channelId
        
        if (!guildId) {
            await interaction.reply("Cette commande doit être exécutée dans un salon...")
            return
        }

        await client.services.registeredChannel.setup(guildId, channelId)
        await interaction.reply("Salon setup avec succès !\n-# *Une poule devrait apparaître d'ici 1 à 10 minutes...*")
    }
}