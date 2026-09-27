import DiscordClient from "./classes/DiscordClient";

export default class ChickenSpawnScheduler {
    constructor(
        private client: DiscordClient
    ) {}

    /**
     * Démarre le spawner pour chaque guilde qui n'a pas déjà une poule en attente
     */
    async startInAllGuilds() {
        const registeredChannels = await this.client.services.registeredChannel.getAll()
        registeredChannels.forEach(registeredChannel => {
            if (!registeredChannel.savedChickenId) this.startForGuild(registeredChannel.guildId)
        })
    }

    startForGuild(guildId: string) {
        const minMilli = 1 * 60_000 // 1 minute
        const maxMilli = 10 * 60_000 // 10 minutes
        const randomTime = Math.floor(Math.random() * (maxMilli - minMilli)) + minMilli

        setTimeout(async () => {
            try {
                const registeredChannel = await this.client.services.registeredChannel.getByGuildId(guildId)
                
                if (registeredChannel) {
                    await this.client.services.spawn.spawnInChannel(registeredChannel.channelId)
                }
            } catch (error) { console.error(error) }
        }, randomTime);
    }
}