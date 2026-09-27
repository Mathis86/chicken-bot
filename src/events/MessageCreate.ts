import { OmitPartialGroupDMChannel, Message } from "discord.js";
import DiscordClient from "../classes/DiscordClient";
import Event from "../classes/Event";
import emojis from "../../datas/emojis";

export default class MessageCreateEvent extends Event<"messageCreate"> {
    name: "messageCreate" = "messageCreate";

    async execute(client: DiscordClient, message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        if (message.author.bot) return

        // Très faible chance de react sous le message d'un utilisateur
        if (Math.random() < 0.01) {
            message.react(emojis.WhiteChicken).catch(console.error)
        }
    }
}