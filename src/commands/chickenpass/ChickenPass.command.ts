import { ChatInputCommandInteraction } from "discord.js";
import Command from "../../classes/Command"
import DiscordClient from "../../classes/DiscordClient";
import { getChickenPassResponse } from "./ChickenPass.view";
import i18n from '../../i18n'

export default class ChickenPassCommand extends Command {
    name: string = "chickenpass";

    async execute(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const guildId = interaction.guildId
        const userId = interaction.user.id

        if (!guildId) {
            await interaction.reply(i18n.t("pass:noGuildId", { lng: interaction.locale }))
            return
        }

        const userDailyQuests = await client.services.quests.getAllByGuildAndUserId(guildId, userId, "DAILY")

        await interaction.reply(getChickenPassResponse(interaction.locale, userDailyQuests))
    }

}