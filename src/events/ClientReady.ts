import Event from "../classes/Event";
import DiscordClient from "../classes/DiscordClient";

export default class ClientReady extends Event<"clientReady"> {
    once: boolean = true;
    name: "clientReady" = "clientReady";

    async execute(client: DiscordClient) {
        const registeredChannels = await client.services.registeredChannel.getAll()
        const guildIds = Array.from(client.guilds.cache.values()).map(g => g.id)

        // Envoie du message de bienvenue dans les serveurs où le bot a été ajouté pendant qu'il était offline
        guildIds.forEach((guildId) => {
            const registered = registeredChannels.find(r => r.guildId === guildId)

            // Si le serveur n'est pas dans la DB -> message de bienvenue
            if (!registered) {
                client.services.registeredChannel.setup(guildId).catch(console.error)
                client.services.message.sendWelcome(guildId).catch(console.error)
            }
            // S'il est dans la DB, qu'il a setup un channel & pas de poule en attente -> démarrer le spawner
            else if (registered.channelId && !registered.savedChickenId) {
                client.chickenSpawnScheduler.startForGuild(registered.guildId)
            }
            // Si poule en attente, relancer le collector
            else {
                client.services.spawn.createCollectorForSavedChannel(registered)
            }
        })

        // Suppression des channels où le bot n'est plus présent
        await client.services.registeredChannel.clearOldGuilds()

        console.log("Le bot est prêt !")
    }
}