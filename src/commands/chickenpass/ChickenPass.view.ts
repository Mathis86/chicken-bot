import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, InteractionReplyOptions, MessageFlags } from "discord.js";
import i18n from "../../i18n"
import { getProgressBar } from "../../utils";
import { UserQuestsGetPayload } from "../../../prisma/generated/models";

export function getChickenPassResponse(locale: string, userQuests: UserQuestsGetPayload<{ include: { quest: true }}>[]): InteractionReplyOptions {
    const level = 16
    const currentXp = 1750
    const maxXp = 3100
    const xpText = getProgressBar(currentXp, maxXp) + ` ${currentXp} / ${maxXp} XP`

    const container = new ContainerBuilder()
        .addTextDisplayComponents(t => t.setContent(`# ChickenPass \`${i18n.t("level", { lng: locale })} ${level}\``))
        // .addSeparatorComponents(s => s)
        .addTextDisplayComponents(t => t.setContent(xpText))
        .addSeparatorComponents(s => s)
        .addTextDisplayComponents(t => t.setContent("## __" + i18n.t("pass:dailyQuestsTitle", { lng: locale }) + "__"))

    for (const userQuest of userQuests) {
        const quest = userQuest.quest
        container.addTextDisplayComponents(t => t.setContent(`**+${quest.xp} XP** ${quest.descriptionFr} (${userQuest.progression} / ${quest.target})`))
    }

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
            .setCustomId("getxp")
            .setLabel(i18n.t("pass:getXp", { lng: locale }))
            .setEmoji('✨')
            .setStyle(ButtonStyle.Success)
    )

    return {
        components: [container, row],
        flags: MessageFlags.IsComponentsV2
    }
}