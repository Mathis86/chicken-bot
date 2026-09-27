import { OmitPartialGroupDMChannel, Message, ChannelType } from "discord.js";
import DiscordClient from "../classes/DiscordClient";
import Event from "../classes/Event";
import emojis from "../../datas/emojis";

export default class MessageCreateEvent extends Event<"messageCreate"> {
    name: "messageCreate" = "messageCreate";

    async execute(client: DiscordClient, message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        // S'assure que le message ne provienne pas d'un bot 
        // Ou qu'il ne soit pas le message initial d'un thread (utile pour les forums)
        if (message.author.bot || message.id === message.channelId) return

        const containsTriggerWord = (text: string) => {
            for (const trigger of ['chicken', 'poule', 'poulet']) {
                if (text.toLowerCase().includes(trigger)) return true
            }
            return false
        }

        // Très faible chance de react sous le message d'un utilisateur
        // Ou chance garantie si le message contient un triggerWord
        if (Math.random() < 0.01 || containsTriggerWord(message.content)) {
            message.react(emojis.WhiteChicken).catch(console.error)
        }
    }
}