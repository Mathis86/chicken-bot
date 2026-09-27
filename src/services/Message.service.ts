import { Channel, GuildTextBasedChannel, PermissionFlagsBits } from "discord.js";
import DiscordClient from "../classes/DiscordClient";

export default class MessageService {
    constructor(
        private readonly client: DiscordClient
    ) {}

    async sendWelcome(guildId: string) {
        const channels = await this.client.guilds.cache.get(guildId)?.channels.fetch()

        if (!channels) return

        // On prend le premier channel dans lequel le bot peut écrire
        for (const channel of channels.values()) {
            if (!channel || !this.canWriteInChannel(channel)) continue
            
            await channel.send("Merci d'avoir invité le bot :)\nFaites \`/admin setup\` pour que les poules commencent à apparaître !\n-# *Dans un channel dédié c'est mieux ;)*")
                .catch(console.error)
            break;
        }
    }

    canWriteInChannel(channel: Channel): channel is GuildTextBasedChannel {
        // Vérifier s'il s'agit bien d'un channel de serveur et qu'on peut écrire dedans
        if (!channel.isSendable() || channel.isDMBased() || !this.client.user) return false
        
        // Vérifier que le bot a les perms pour écrire dedans
        const permissions = channel.permissionsFor(this.client.user)
        if (!permissions?.has(PermissionFlagsBits.SendMessages)) return false

        return true
    }
}