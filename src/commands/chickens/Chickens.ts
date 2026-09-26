import { ButtonInteraction, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import Command from "../../classes/Command";
import DiscordClient from "../../classes/DiscordClient";
import ChickensState from "./Chickens.state";
import getChickensComponents, { getEggsComponent } from "./Chickens.view";
import CustomCollector from "../../classes/CustomCollector";

class ChickensCommand extends Command {
    name: string = "chickens";

    async execute(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const user = interaction.options.getUser('joueur') || interaction.user
        const guildId = interaction.guildId

        if (!guildId) {
            await interaction.reply("Cette commande doit être exécutée dans un serveur...")
            return
        }

        const userChickens = await client.services.chicken.getByUserAndGuild(guildId, user.id)

        if (userChickens.length === 0) {
            let responseText = `Vous n'avez pas encore de poule...\nAttendez qu'une poule apparaîsse dans le channel dédié et écrivez "ckn" pour la capturer :)`
            if (user.id !== interaction.user.id) responseText = `**${user.displayName}** n'a pas encore de poule...`

            await interaction.reply(responseText)
            return
        }
        
        const state = new ChickensState(interaction, user, userChickens)
        const components = getChickensComponents(state)

        const response = await interaction.reply({
            components,
            flags: MessageFlags.IsComponentsV2
        })

        // Rien à collecter si le joueur consulte l'inventaire d'un autre
        if (!state.isCommandAuthor) return
            
        new CustomCollector(response, interaction.user.id, "Tu ne peux pas voler les oeufs de tes camarades...\n-# (Pas encore... ça reste entre nous)")
            // Bouton "Récupérer tous les oeufs"
            .addRoute<ButtonInteraction>('eggs', async (interaction) => {
                const collectedEggs = await client.services.chicken.collectAllEggs(guildId, user.id)

                const newUserChickens = await client.services.chicken.getByUserAndGuild(guildId, user.id)
                state.userChickens = newUserChickens

                await interaction.update({
                    components: getChickensComponents(state)
                })

                await interaction.followUp({
                    components: [getEggsComponent(collectedEggs)],
                    flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
                })
            })
    }

}

export default new ChickensCommand()