import { CollectedMessageInteraction, InteractionCollector, InteractionResponse, MessageFlags } from "discord.js";
import i18n from "../i18n"

type RouteFn<T extends CollectedMessageInteraction> = (interaction: T, ...params: string[]) => Promise<void> | void

type Options = {
    userId?: string, 
    errorMessage?: string,
    idle?: number
}

export default class CustomCollector {
    collector: InteractionCollector<CollectedMessageInteraction>
    private routesMap = new Map<string, RouteFn<any>>()

    constructor(message: InteractionResponse, opt?: Options ) {
        this.collector = message.createMessageComponentCollector({ idle: opt?.idle || 15 * 60_000 })

        this.collector.on('collect', async (interaction) => {
            if (opt?.userId && interaction.user.id !== opt.userId) {
                await interaction.reply({
                    content: opt.errorMessage || i18n.t("notTheCommandAuthor", { lng: interaction.locale }),
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