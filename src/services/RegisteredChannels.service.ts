import { PermissionFlagsBits } from "discord.js";
import DiscordClient from "../classes/DiscordClient";

export default class RegisteredChannelService {
    constructor(
        private client: DiscordClient
    ) {}

    async getAll() {
        return await this.client.prisma.registeredChannels.findMany()
    }

    async getByGuildId(guildId: string) {
        return await this.client.prisma.registeredChannels.findUnique({
            where: { guildId }
        })
    }

    /**
     * Synchronise toutes les guilds dans lequel le bot est présent avec la DB.
     * Utile au démarrage du bot dans le cas d'un crash.
     */
    async sync() {
        const registeredChannels = await this.getAll()
        const guildIds = Array.from(this.client.guilds.cache.values()).map(g => g.id)

        // Enregistrement des channels non présents dans la DB
        guildIds.forEach(guildId => {
            if (!registeredChannels.find(r => r.guildId === guildId)) {
                this.setFirstValidChannel(guildId)
            }
        })

        // Suppression des channels où le bot n'est plus présent
        await this.client.prisma.registeredChannels.deleteMany({
            where: { guildId: { notIn: guildIds }}
        })
    }
    
    /**
     * Ajoute le channel de spawn d'un serveur dans la DB.
     */
    async set(guildId: string, channelId: string) {
        await this.client.prisma.registeredChannels.upsert({
            create: { guildId, channelId },
            update: { channelId },
            where: { guildId }
        })
    }

    /**
     * Retire le channel de spawn d'un serveur de la DB
     */
    async remove(guildId: string) {
        await this.client.prisma.registeredChannels.delete({
            where: { guildId }
        })
    }

    /**
     * Ajoute le premier channel valide d'un serveur dans la DB
     * Retourne l'id du channel paramétré, ou null si pas trouvé
     */
    async setFirstValidChannel(guildId: string) {
        // Si le bot n'a pas de "user", ça ne sert à rien de faire quoi que ce soit
        if (!this.client.user) return null

        const channels = await this.client.guilds.cache.get(guildId)?.channels.fetch()

        if (!channels) return null

        // On prend le premier channel dans lequel le bot peut écrire
        for (const channel of channels.values()) {
            if (!channel) continue
            const permissions = channel.permissionsFor(this.client.user)

            // Si on ne peut pas envoyer de message dans ce channel ou que le bot n'a pas la permission d'envoyer de message, on skip
            if (!channel.isSendable() || !permissions || !permissions.has(PermissionFlagsBits.SendMessages)) continue

            // On setup le premier channel qui est OK
            await this.set(guildId, channel.id)

            return channel.id;
        }

        return null
    }

    /**
     * Sauvegarde d'une poule dans un serveur pour reprise de collector en cas de redémarrage du bot
     */
    async saveChicken(guildId: string, chickenId: number, messageId: string, startTime: number) {
        await this.client.prisma.registeredChannels.update({
            data: { 
                savedChicken: { connect: { id: chickenId } },
                savedMessageId: messageId,
                savedStartTime: new Date(startTime)
            },
            where: { guildId }
        })
    }

    /**
     * Suppression de la sauvegarde de la poule d'un serveur
     */
    async forgetSavedChicken(guildId: string) {
        await this.client.prisma.registeredChannels.update({
            data: { 
                savedChicken: { disconnect: true },
                savedMessageId: null,
                savedStartTime: null
            },
            where: { guildId }
        })
    }
}