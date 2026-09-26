import Event from "../classes/Event";
import DiscordClient from "../classes/DiscordClient";
import { Interaction, CacheType } from "discord.js";

class InteractionCreate extends Event<"interactionCreate"> { 
    name: "interactionCreate" = "interactionCreate";

    async execute(client: DiscordClient, interaction: Interaction<CacheType>) {
        if (!interaction.isChatInputCommand()) return
        
        client.tryToExecuteCommand(interaction)
    }
}

export default new InteractionCreate()