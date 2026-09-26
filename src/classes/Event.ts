import { ClientEvents } from "discord.js"
import DiscordClient from "./DiscordClient"

export default abstract class Event<K extends keyof ClientEvents> {
    once: boolean = false
    abstract name: K

    abstract execute(client: DiscordClient, ...args: ClientEvents[K]): Promise<void>
}