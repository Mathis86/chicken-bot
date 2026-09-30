import { Quests } from "../../prisma/generated/client";
import { QuestFrequency } from "../../prisma/generated/enums";
import { UserQuestsCreateManyInput } from "../../prisma/generated/models";
import DiscordClient from "../classes/DiscordClient";

export default class QuestsService {
    constructor(
        private readonly client: DiscordClient
    ) {}

    /**
     * Renvoie les quêtes actuelles d'un joueur.
     * S'il n'en a pas, les créé pour lui et les renvoie.
     */
    async getAllByGuildAndUserId(guildId: string, userId: string, questFrequency: QuestFrequency) {   
        const userQuests = await this.client.prisma.userQuests.findMany({
            include: { quest: true },
            where: { userDiscordId: userId, guildId, quest: { frequency: questFrequency } }
        })

        // Renvoyer les quêtes si le joueur en a
        if (userQuests.length > 0) return userQuests

        // Donner des quêtes à l'utilisateur s'il n'en a pas
        return await this.createIfNone(guildId, userId, questFrequency)
    }

    private async getRandoms(questFrequency: QuestFrequency) {
        const quests = await this.client.prisma.quests.findMany({ where: { frequency: questFrequency }})
        if (quests.length === 0) throw new Error("Il n'y a pas de quêtes dans la BDD...")

        const randomQuests: Quests[] = []
        for (let i = 0; i < 3; i++) {
            const index = Math.floor(Math.random() * quests.length)
            const quest = quests[index]
            if (!quest) break

            randomQuests.push(quest)
            quests.splice(index, 1)
        }

        return randomQuests
    }

    private async createIfNone(guildId: string, userId: string, questFrequency: QuestFrequency) {
        const quests = await this.getRandoms(questFrequency)
        const dataToCreate: UserQuestsCreateManyInput[] = quests.map(q => { return {
            guildId,
            userDiscordId: userId,
            questId: q.id,
        }})

        await this.client.prisma.userQuests.createMany({
            data: dataToCreate
        })

        return await this.client.prisma.userQuests.findMany({
            include: { quest: true },
            where: { userDiscordId: userId, guildId, quest: { frequency: questFrequency } }
        })
    }
}