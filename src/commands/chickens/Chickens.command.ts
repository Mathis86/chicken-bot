import { ButtonInteraction, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import Command from "../../classes/Command";
import DiscordClient from "../../classes/DiscordClient";
import ChickensState from "./Chickens.state";
import getChickensComponents, { getEggsComponent } from "./Chickens.view";
import CustomCollector from "../../classes/CustomCollector";
import i18n from '../../i18n'

export default class ChickensCommand extends Command {
    name: string = "chickens";

    async execute(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const user = interaction.options.getUser('joueur') || interaction.user
        const guildId = interaction.guildId

        if (!guildId) {
            await interaction.reply(i18n.t("chickens:noGuildId", { lng: interaction.locale }))
            return
        }

        const userChickens = await client.services.chicken.getByUserAndGuild(guildId, user.id)

        if (userChickens.length === 0) {
            let responseText = i18n.t("chickens:noChickens", { lng: interaction.locale })
            if (user.id !== interaction.user.id) responseText = i18n.t("chickens:noChickensOther", { lng: interaction.locale, username: user.displayName })

            await interaction.reply(responseText)
            return
        }
        
        let state = new ChickensState(interaction, user, userChickens)

        const response = await interaction.reply({
            components: getChickensComponents(state),
            flags: MessageFlags.IsComponentsV2
        })

        // Rien à collecter si le joueur consulte l'inventaire d'un autre
        if (!state.isCommandAuthor) return
            
        new CustomCollector(response, {
            userId: interaction.user.id,
            errorMessage: i18n.t("chickens:tryToSteal", { lng: interaction.locale })
        })
            // Bouton "Récupérer tous les oeufs"
            .addRoute<ButtonInteraction>('eggs', async (i) => {
                const collectedEggs = await client.services.chicken.collectAllEggs(guildId, user.id)

                const newUserChickens = await client.services.chicken.getByUserAndGuild(guildId, user.id)
                state.userChickens = newUserChickens

                await i.update({
                    components: getChickensComponents(state)
                })

                await i.followUp({
                    components: [getEggsComponent(collectedEggs)],
                    flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
                })
            })
            // Bouton rafraichir
            .addRoute<ButtonInteraction>('refresh', async (i) => {
                const userChickens = await client.services.chicken.getByUserAndGuild(guildId, user.id)
                state = new ChickensState(interaction, i.user, userChickens)
                await i.update({ components: getChickensComponents(state) })
            })
            .onEnd(async () => {
                state.expired = true
                await interaction.editReply({ components: getChickensComponents(state) })
            })
    }
}