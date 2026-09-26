import { GuildTextBasedChannel, Message, MessageCollector } from "discord.js"
import DiscordClient from "../classes/DiscordClient"
import { getAttachmentByImagename } from "../utils"
import { Chickens } from "../../prisma/generated/client"

export default class SpawnService {
    constructor(
        private readonly client: DiscordClient
    ) {}

    /**
     * Fait apparaitre une poule dans un channel et attend qu'un utilisateur la capture.
     * Une fois capturée, relance le scheduler pour la prochaine poule.
     */
    async spawnInChannel(channelId: string) {
        const channel = await this.client.channels.fetch(channelId)

        // Si le channel existe et que le bot peut écrire dedans
        if (channel && this.client.services.message.canWriteInChannel(channel)) {
            const randomChicken = await this.client.services.chicken.getRandom()

            const chickenMessage = await channel.send({
                content: this.getText(randomChicken),
                files: randomChicken.imageName ? [getAttachmentByImagename(randomChicken.imageName)] : []
            })

            const startTime = Date.now()

            // Enregistrement de la poule en BDD pour relancer le collector en cas de redémarrage du bot
            await this.client.services.registeredChannel.saveChicken(channel.guildId, randomChicken.id, chickenMessage.id, startTime)

            // Collecter les réponses et attendre "ckn" pour valider la capture
            await this.createCollector(channel, chickenMessage, startTime, randomChicken)
        }
    }

    /**
     * Renvoie la phrase de spawn en fonction de la rareté de la poule
     */
    private getText(chicken: Chickens & { rate: number }) {
        const emojiId = chicken.emojiId ? (chicken.emojiId + " ") : ""

        if (chicken.rate < 0.01) return `# OMGGGG !!!!!!!!!!\n**UNE ${emojiId}${chicken.name.toUpperCase()} VIENT D'APPARAÎTRE !!!**\n**ÉCRIS VITE "CKN" POUR LA CAPTURER !!!**`
        if (chicken.rate < 0.05) return `**WOAH**, une ${emojiId}**${chicken.name}** vient d'apparaître !!\nÉcris "ckn" pour la capturer !`
        if (chicken.rate < 0.1) return `Ohhh pas mal, une ${emojiId}**${chicken.name}** vient d'apparaître !\nÉcris "ckn" pour la capturer !`
        if (chicken.rate < 0.2) return `Une ${emojiId}**${chicken.name}** vient d'apparaître, on la voit pas souvent celle-là.\nÉcris "ckn" pour la capturer !`
        return `Une ${emojiId}**${chicken.name}** vient d'apparaître.\nÉcris "ckn" pour la capturer !`
    }

    /**
     * Collector qui attend qu'un joueur capture la poule
     */
    private async createCollector(channel: GuildTextBasedChannel, chickenMessage: Message, startTime: number, chicken: Chickens) {
        // Collecter les réponses et attendre "ckn" pour valider la capture
        const collector = channel.createMessageCollector()

        collector.on("collect", async (message) => {
            try {
                if (!message.inGuild()) return

                const guildId = message.guildId
                const userId = message.author.id

                // L'utilisateur a capturé la poule
                if (message.content.toLowerCase() === "ckn") {
                    // Suppression de la sauvegarde de la poule du serveur
                    await this.client.services.registeredChannel.forgetSavedChicken(guildId)

                    // Ajout de la poule à l'utilisateur dans la DB
                    await this.client.services.chicken.addToUser(guildId, userId, chicken.id)

                    const timeToCatch = ((Date.now() - startTime) / 1000).toFixed(1)
                    collector.stop()

                    // Suppression du message de la poule
                    if (chickenMessage.deletable) chickenMessage.delete().catch(console.error)

                    if (message.channel.isSendable()) {
                        const emojiId = chicken.emojiId ? (chicken.emojiId + " ") : ""
                        await message.channel.send(`<@${userId}> a capturé la ${emojiId}**${chicken.name}** en \`${timeToCatch}\` secondes !!`)
                    }

                    // Relancer le scheduler
                    await this.client.chickenSpawnScheduler.startForGuild(guildId)
                }
            } catch (error) { console.error(error) }
        })
    }

    /**
     * Relance d'un collector pour chaque poule sauvegardée en BDD
     */
    async createCollectorForEachSavedChicken() {
        const registeredChannels = await this.client.prisma.registeredChannels.findMany({
            include: { savedChicken: true },
            where: { savedChicken: { isNot: null }}
        })

        registeredChannels.forEach(async (registeredChannel) => {
            const channel = await this.client.channels.fetch(registeredChannel.channelId)
            if (channel && this.client.services.message.canWriteInChannel(channel)) {
                const { savedChicken, savedMessageId, savedStartTime } = registeredChannel
                if (!savedChicken || !savedMessageId || !savedStartTime) return

                const message = await channel.messages.fetch(savedMessageId).catch(console.error)
                if (!message) return

                await this.createCollector(channel, message, savedStartTime.getTime(), savedChicken)
            }
        })
    }
}