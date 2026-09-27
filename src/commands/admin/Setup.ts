import { ChatInputCommandInteraction } from "discord.js";
import Command from "../../classes/Command";
import DiscordClient from "../../classes/DiscordClient";

export default class SetupCommand extends Command {
    name: string = "admin.setup";
    isAdmin: boolean = true;

    async execute(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const guildId = interaction.guildId
        const channelId = interaction.channelId
        
        if (!guildId) {
            await interaction.reply("`❌` Je sais pas où on est là mais je peux t'assurer que cette commande va pas fonctionner ici\n-# *Essaye la dans un channel textuel normal pour voir ?*")
            return
        }

        const registered = await client.services.registeredChannel.getByGuildId(guildId)

        if (registered?.channelId && registered.channelId === interaction.channelId) {
            await interaction.reply("`❌` Ce channel est déjà setup, tu n'as rien à faire ici t'inquiète\n-# *Tu voulais peut-être faire `/admin forget` ?*")
            return
        }

        await client.services.registeredChannel.setup(guildId, channelId)
        await interaction.reply("`✅` Salon setup avec succès !\n-# *Une poule devrait apparaître d'ici 1 à 10 minutes...*")
    }
}