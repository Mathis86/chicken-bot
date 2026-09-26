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

    async startForGuild(guildId: string) {
        const minMilli = 3 * 1000 // 3 minutes
        const maxMilli = 5 * 1000 // 5 minutes
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