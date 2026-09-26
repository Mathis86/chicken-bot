import { Guild } from "discord.js";
import DiscordClient from "../classes/DiscordClient";
import Event from "../classes/Event";

class GuildCreate extends Event<"guildCreate"> {
    name: "guildCreate" = "guildCreate";

    async execute(client: DiscordClient, guild: Guild) {
        const channelId = await client.services.registeredChannel.setFirstValidChannel(guild.id)
        if (channelId) {
            await client.services.message.sendWelcome(channelId)
            await client.chickenSpawnScheduler.startForGuild(guild.id)
        }
    }
}

export default new GuildCreate()