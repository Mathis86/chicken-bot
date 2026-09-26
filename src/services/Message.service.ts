import { Channel, GuildTextBasedChannel, PermissionFlagsBits } from "discord.js";
import DiscordClient from "../classes/DiscordClient";

export default class MessageService {
    constructor(
        private readonly client: DiscordClient
    ) {}

    async sendWelcome(channelId: string) {
        await this.trySend(channelId, "Merci d'avoir invité le bot :)\nIl est conseillé de créer un channel dédié et d'y faire \`/setup\` si vous voulez que les poules apparaissent la-bas\nSinon, elles apparaitront ici")
    }

    async sendChicken(channelId: string) {
        return await this.trySend(channelId, "Voici une poule. Écris \"ckn\" pour la capturer.")
    }

    canWriteInChannel(channel: Channel): channel is GuildTextBasedChannel {
        // Vérifier s'il s'agit bien d'un channel de serveur et qu'on peut écrire dedans
        if (!channel.isSendable() || channel.isDMBased() || !this.client.user) return false
        
        // Vérifier que le bot a les perms pour écrire dedans
        const permissions = channel.permissionsFor(this.client.user)
        if (!permissions?.has(PermissionFlagsBits.SendMessages)) return false

        return true
    }

    private async trySend(channelId: string, message: string) {
        const channel = await this.client.channels.fetch(channelId)
        if (channel && this.canWriteInChannel(channel)) {
            return await channel.send(message).catch(console.error)
        }
        return null
    }
}