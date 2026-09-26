import { CollectedMessageInteraction, InteractionCollector, InteractionResponse, MessageFlags } from "discord.js";

type RouteFn<T extends CollectedMessageInteraction> = (interaction: T, ...params: string[]) => Promise<void> | void

export default class CustomCollector {
    collector: InteractionCollector<CollectedMessageInteraction>
    private routesMap = new Map<string, RouteFn<any>>()

    constructor(message: InteractionResponse, userId?: string, errorMessage?: string) {
        this.collector = message.createMessageComponentCollector()

        this.collector.on('collect', async (interaction) => {
            if (userId && interaction.user.id !== userId) {
                await interaction.reply({
                    content: errorMessage || "Tu n'es pas l'auteur de cette commande.",
                    flags: MessageFlags.Ephemeral
                })
                return
            }

            const params = interaction.customId.split(':')
            const routeName = params.shift()
            if (!routeName) return

            const routeFn = this.routesMap.get(routeName)
            if (!routeFn) return

            await routeFn(interaction, ...params)?.catch(console.error)
        })
    }

    addRoute<T extends CollectedMessageInteraction>(name: string, fn: RouteFn<T>): this {
        this.routesMap.set(name, fn as RouteFn<any>)
        return this
    }
}