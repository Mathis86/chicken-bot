import { GuildTextBasedChannel, Message, MessageCollector } from "discord.js"
import DiscordClient from "../classes/DiscordClient"
import { getAttachmentByImagename } from "../utils"
import { Chickens, Prisma } from "../../prisma/generated/client"

export default class SpawnService {
    private channelsCollectors = new Map<string, MessageCollector>()

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
        else {
            console.log(`Le bot n'a pas pu écrire dans le channel ${channelId}. Déserengistrement de la BDD...`)
            await this.client.services.registeredChannel.forget(channelId)
        }
    }

    /**
     * Renvoie la phrase de spawn en fonction de la rareté de la poule
     */
    private getText(chicken: Chickens & { rate: number }) {
        const emojiId = chicken.emojiId ? (chicken.emojiId + " ") : ""

        if (chicken.rate < 0.01) return `# OMGGGG !!!!!!!!!!\n**UNE ${emojiId}${chicken.name.toUpperCase()} VIENT D'APPARAÎTRE !!!**\n**ÉCRIS VITE "CKN" POUR LA CAPTURER !!!**`
        if (chicken.rate < 0.05) return `**WOAH**, une ${emojiId}**${chicken.name}** vient d'apparaître !!\n-# *Écris "ckn" pour la capturer !*`
        if (chicken.rate < 0.1) return `Ohhh pas mal, une ${emojiId}**${chicken.name}** vient d'apparaître !\n-# *Écris "ckn" pour la capturer !*`
        if (chicken.rate < 0.2) return `Une ${emojiId}**${chicken.name}** vient d'apparaître, on la voit pas souvent celle-là.\n-# *Écris "ckn" pour la capturer !*`
        return `Une ${emojiId}**${chicken.name}** vient d'apparaître.\n-# *Écris "ckn" pour la capturer !*`
    }

    /**
     * Collector qui attend qu'un joueur capture la poule
     */
    private async createCollector(channel: GuildTextBasedChannel, chickenMessage: Message, startTime: number, chicken: Chickens) {
        // Si un collector existe déjà, on le stop
        this.channelsCollectors.get(channel.guildId)?.stop()

        // Collecter les réponses et attendre "ckn" pour valider la capture
        const collector = channel.createMessageCollector()
        this.channelsCollectors.set(channel.guildId, collector)

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

                    collector.stop()

                    // Suppression du message de la poule
                    if (chickenMessage.deletable) chickenMessage.delete().catch(console.error)

                    if (message.channel.isSendable()) {
                        const emojiId = chicken.emojiId ? (chicken.emojiId + " ") : ""
                        await message.channel.send(`<@${userId}> a capturé la ${emojiId}**${chicken.name}** en ${timeToCatchFormat(Date.now() - startTime)} !!`)
                    }

                    // Relancer le scheduler
                    this.client.chickenSpawnScheduler.startForGuild(channel.guildId)
                }
            } catch (error) { console.error(error) }
        })

        function timeToCatchFormat(ms: number) {
            const date = new Date(ms)
            const minutes = date.getMinutes()
            const seconds = date.getSeconds()
            if (minutes === 0) return `\`${(ms / 1000).toFixed(1)}\` seconde${ms > 1000 ? 's' : ''}`
            return `\`${minutes}\` minute${minutes > 1 ? 's' : ''} et \`${seconds}\` seconde${seconds > 1 ? 's' : ''}`
        }
    }

    /**
     * Relance d'un collector pour chaque poule sauvegardée en BDD
     */
    async createCollectorForSavedChannel(registeredChannel: Prisma.RegisteredChannelsGetPayload<{ include: { savedChicken: true }}>) {
        const { savedChicken, savedMessageId, savedStartTime, channelId } = registeredChannel
        if (!savedChicken || !savedMessageId || !savedStartTime || !channelId) return

        const channel = await this.client.channels.fetch(channelId)
        
        if (channel && this.client.services.message.canWriteInChannel(channel)) {
            const message = await channel.messages.fetch(savedMessageId).catch(console.error)
            if (!message) return

            await this.createCollector(channel, message, savedStartTime.getTime(), savedChicken)
        }
    }
}