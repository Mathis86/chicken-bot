import { ChatInputCommandInteraction } from "discord.js";
import Command from "../../classes/Command";
import DiscordClient from "../../classes/DiscordClient";
import i18n from "../../i18n";

export default class SetupCommand extends Command {
    name: string = "admin.setup";
    isAdmin: boolean = true;

    async execute(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const guildId = interaction.guildId
        const channelId = interaction.channelId
        
        if (!guildId) {
            await interaction.reply(i18n.t('setup:noGuildId', { lng: interaction.locale }))
            return
        }

        const registered = await client.services.registeredChannel.getByGuildId(guildId)

        if (registered?.channelId && registered.channelId === interaction.channelId) {
            await interaction.reply(i18n.t('setup:alreadySetup', { lng: interaction.locale }))
            return
        }

        await client.services.registeredChannel.setup(guildId, channelId)
        await interaction.reply(i18n.t('setup:success', { lng: interaction.locale }))
    }
}