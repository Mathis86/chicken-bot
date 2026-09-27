import { ChatInputCommandInteraction } from "discord.js";
import Command from "../../classes/Command";
import DiscordClient from "../../classes/DiscordClient";

export default class ForgetCommand extends Command {
    name: string = "admin.forget";

    async execute(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const guildId = interaction.guildId

        if (!guildId) {
            await interaction.reply("`❌` Je sais pas où on est là mais je peux t'assurer que cette commande va pas fonctionner ici\n-# *Essaye la dans un channel textuel normal pour voir ?*")
            return
        }

        const registered = await client.services.registeredChannel.getByGuildId(guildId)

        if (!registered || !registered.channelId) {
            await interaction.reply("`❌` T'as aucun channel de setup, ça sert à rien d'essayer cette commande broski\n-# *Essaye plutôt `/admin setup`, me remercie pas ;)*")
            return
        }

        if (registered.channelId !== interaction.channelId) {
            await interaction.reply("`❌` Ce channel n'est pas setup, lâche ça\n-# *Essaye plutôt `/admin setup`, me remercie pas ;)*")
            return
        }

        await client.services.registeredChannel.forgetChannel(guildId)

        await interaction.reply("`✅` Ce channel a bien été oublié de mes magnifiques bases de données :>\n-# *Plus aucune poule viendra vous embêter ici promis...*")
    }
}