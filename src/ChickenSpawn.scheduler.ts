import { config } from "../config";
import DiscordClient from "./classes/DiscordClient";

export default class ChickenSpawnScheduler {
    private guildsTimeouts = new Map<string, NodeJS.Timeout>()

    constructor(
        private client: DiscordClient
    ) {}

    /**
     * Démarre le spawner pour chaque guilde qui a un channel setup et qui n'a pas déjà une poule en attente
     */
    async startInRegisteredGuilds() {
        const registeredChannels = await this.client.services.registeredChannel.getAll()
        registeredChannels.forEach(({ savedChickenId, channelId, savedRemainingTime, guildId }) => {
            let remainingMs
            if (savedRemainingTime) remainingMs = Math.max(savedRemainingTime.getTime() - Date.now(), 0)
            if (channelId && !savedChickenId) this.startForGuild(guildId, remainingMs)
        })
    }

    startForGuild(guildId: string, remainingMs?: number) {
        const minMilli = 1 * 60_000 // 1 minute
        const maxMilli = 10 * 60_000 // 10 minutes

        remainingMs = remainingMs || Math.floor(Math.random() * (maxMilli - minMilli)) + minMilli
        
        const timeout = setTimeout(async () => {
            const registered = await this.client.services.registeredChannel.getByGuildId(guildId)
            if (registered && registered.channelId) this.client.services.spawn.spawnInChannel(registered.channelId).catch(console.error)
        }, config.isProd ? remainingMs : 3500);

        // Ecraser le timeout existant le cas échéant
        this.guildsTimeouts.get(guildId)?.close()
        this.guildsTimeouts.set(guildId, timeout)
    }

    stopForGuild(guildId: string) {
        const timeout = this.guildsTimeouts.get(guildId)
        if (timeout) {
            timeout.close()
            this.guildsTimeouts.delete(guildId)
        }
    }
}