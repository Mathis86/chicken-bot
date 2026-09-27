import { PermissionFlagsBits } from "discord.js";
import DiscordClient from "../classes/DiscordClient";

export default class RegisteredChannelService {
    constructor(
        private client: DiscordClient
    ) {}

    async getAll() {
        return await this.client.prisma.registeredChannels.findMany({
            include: { savedChicken: true }
        })
    }

    async getByGuildId(guildId: string) {
        return await this.client.prisma.registeredChannels.findUnique({
            where: { guildId }
        })
    }

    /**
     * Supprime tous les serveurs enregistrés dans lesquels le bot n'est plus présent
     * Utile au démarrage du bot dans le cas d'un crash.
     */
    async clearOldGuilds() {
        const guildIds = Array.from(this.client.guilds.cache.values()).map(g => g.id)

        // Suppression des channels où le bot n'est plus présent
        await this.client.prisma.registeredChannels.deleteMany({
            where: { guildId: { notIn: guildIds }}
        })
    }
    
    /**
     * Ajoute le channel de spawn d'un serveur dans la DB.
     * Démarre le spawner.
     */
    async setup(guildId: string, channelId?: string) {
        await this.client.prisma.registeredChannels.upsert({
            create: { guildId, channelId },
            update: { channelId },
            where: { guildId }
        })
        if (channelId) this.client.chickenSpawnScheduler.startForGuild(guildId)
    }

    /**
     * Retire le channel de spawn d'un serveur de la DB.
     * Arrête le spawner.
     */
    async forget(guildId: string) {
        await this.client.prisma.registeredChannels.deleteMany({
            where: { guildId }
        })
        this.client.chickenSpawnScheduler.stopForGuild(guildId)
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