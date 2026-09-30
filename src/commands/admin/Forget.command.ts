import { ChatInputCommandInteraction } from "discord.js";
import Command from "../../classes/Command";
import DiscordClient from "../../classes/DiscordClient";
import i18n from "../../i18n"

export default class ForgetCommand extends Command {
    name: string = "admin.forget";

    async execute(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const guildId = interaction.guildId
        const channelId = interaction.channelId

        if (!guildId) {
            await interaction.reply(i18n.t("forget:noGuildId", { lng: interaction.locale }))
            return
        }

        const registered = await client.services.registeredChannel.getByGuildId(guildId)

        if (!registered || !registered.channelId) {
            await interaction.reply(i18n.t("forget:noSetupChannel", { lng: interaction.locale }))
            return
        }

        if (registered.channelId !== interaction.channelId) {
            await interaction.reply(i18n.t("forget:notSetup", { lng: interaction.locale }))
            return
        }

        await client.services.registeredChannel.forgetChannel(channelId)

        await interaction.reply(i18n.t("forget:success", { lng: interaction.locale }))
    }
}