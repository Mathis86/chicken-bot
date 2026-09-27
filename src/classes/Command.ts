import { ChatInputCommandInteraction } from "discord.js";
import DiscordClient from "./DiscordClient";

export default abstract class Command {
    abstract name: string
    isAdmin: boolean = false
    abstract execute(client: DiscordClient, interaction: ChatInputCommandInteraction): Promise<void>
}