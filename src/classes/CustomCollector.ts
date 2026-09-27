import { CollectedMessageInteraction, InteractionCollector, InteractionResponse, MessageFlags } from "discord.js";

type RouteFn<T extends CollectedMessageInteraction> = (interaction: T, ...params: string[]) => Promise<void> | void

type Options = {
    userId?: string, 
    errorMessage?: string,
    idle?: number
}

export default class CustomCollector {
    collector: InteractionCollector<CollectedMessageInteraction>
    private routesMap = new Map<string, RouteFn<any>>()

    constructor(message: InteractionResponse, { idle = 60_000, userId, errorMessage }: Options ) {
        this.collector = message.createMessageComponentCollector({ idle })

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

    onEnd(fn: () => Promise<void> | void): this {
        this.collector.once('end', () => fn()?.catch(console.error))
        return this
    }
}