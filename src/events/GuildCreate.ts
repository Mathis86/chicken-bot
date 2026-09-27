import { Guild } from "discord.js";
import DiscordClient from "../classes/DiscordClient";
import Event from "../classes/Event";

export default class GuildCreateEvent extends Event<"guildCreate"> {
    name: "guildCreate" = "guildCreate";

    async execute(client: DiscordClient, guild: Guild) {
        await client.services.registeredChannel.setup(guild.id)
        await client.services.message.sendWelcome(guild.id)
    }
}