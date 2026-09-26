import { Guild } from "discord.js";
import DiscordClient from "../classes/DiscordClient";
import Event from "../classes/Event";

class GuildDelete extends Event<"guildDelete"> {
    name: "guildDelete" = "guildDelete";

    async execute(client: DiscordClient, guild: Guild) {
        await client.registeredChannelService.remove(guild.id)
    }
}

export default new GuildDelete()