import { Guild } from "discord.js";
import DiscordClient from "../classes/DiscordClient";
import Event from "../classes/Event";

export default class GuildDelete extends Event<"guildDelete"> {
    name: "guildDelete" = "guildDelete";

    async execute(client: DiscordClient, guild: Guild) {
        await client.services.registeredChannel.delete(guild.id)
    }
}