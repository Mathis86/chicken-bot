import Event from "../classes/Event";
import DiscordClient from "../classes/DiscordClient";

class ClientReady extends Event<"clientReady"> {
    once: boolean = true;
    name: "clientReady" = "clientReady";

    async execute(client: DiscordClient) {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // Synchronise les channels enregistrés en base avec la réalité
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        const registeredChannels = await client.services.registeredChannel.getAll()
        const guildIds = Array.from(client.guilds.cache.values()).map(g => g.id)

        // Enregistrement des channels non présents dans la DB
        // Et envoie du message de bienvenue
        guildIds.forEach(async (guildId) => {
            try {  
                if (!registeredChannels.find(r => r.guildId === guildId)) {
                    const channelId = await client.services.registeredChannel.setFirstValidChannel(guildId)
                    if (channelId) await client.services.message.sendWelcome(channelId)
                }
            } catch (error) { console.error(error) }
        })

        // Suppression des channels où le bot n'est plus présent
        await client.prisma.registeredChannels.deleteMany({
            where: { guildId: { notIn: guildIds }}
        })

        // Démarre le spawning de poule pour chaque channel enregistré qui n'a pas déjà une poule en attente
        await client.chickenSpawnScheduler.startInAllGuilds()

        // Relance le collector pour chaque guild qui avait une poule en attente
        await client.services.spawn.createCollectorForEachSavedChicken()

        console.log("Le bot est prêt !")
    }
}

export default new ClientReady()