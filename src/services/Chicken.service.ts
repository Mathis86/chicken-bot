import { Chickens } from "../../prisma/generated/client";
import { TransactionClient } from "../../prisma/generated/internal/prismaNamespace";
import DiscordClient from "../classes/DiscordClient";

export type CollectedEggs = ({ chicken: Chickens, amount: number})[]

export default class ChickenService {
    constructor(
        private client: DiscordClient
    ) {}

    /**
     * Renvoie une poule aléatoire en fonction de sa valeur
     */
    async getRandom() {
        const chickens = await this.client.prisma.chickens.findMany({ orderBy: { value: "desc" }})
        if (chickens.length === 0) throw new Error("Aucune poule dans la table 'chickens'")

        // Calcul du poids total de toutes les poules
        let totalWeight = 0
        for (const chicken of chickens) totalWeight += 1 / chicken.value

        // Renvoie d'une poule au hasard
        const randomNum = Math.random()
        let totalRates = 0
        for (const chicken of chickens) {
            const rate = (1 / chicken.value) / totalWeight
            totalRates += rate
            if (randomNum < totalRates) return { ...chicken, rate }
        }

        // Renvoyer une erreur si aucune poule n'a été tirée (cas anormal)
        throw new Error("Aucune poule n'a été tirée aléatoirement")
    }

    /**
     * Ajoute une poule à un utilisateur pour un serveur précis.
     */
    async addToUser(guildId: string, userId: string, chickenId: number) {
        await this.client.prisma.userChickens.upsert({
            create: { guildId, userDiscordId: userId, chickenId, nextEggAt: await this.getNextEggDate(chickenId) },
            update: { amount: { increment: 1 }},
            where: { userDiscordId_guildId_chickenId: { guildId, userDiscordId: userId, chickenId } }
        })
    }

    /**
     * Renvoie toutes les poules d'un utilisateur sur un serveur précis
     */
    async getByUserAndGuild(guildId: string, userId: string, tx?: TransactionClient) {
        const client = tx || this.client.prisma
        return await client.userChickens.findMany({
            include: { chicken: true },
            where: { guildId, userDiscordId: userId }
        })
    }

    /**
     * Renvoie la date de récolte du prochain oeuf d'une poule
     */
    async getNextEggDate(chickenId: number) {
        const chicken = await this.client.prisma.chickens.findUnique({ where: { id: chickenId }})
        if (!chicken) throw new Error(`La poule ${chickenId} n'existe pas. La date de sa prochaine ponte ne peut pas être calculée.`)

        return new Date(Date.now() + chicken.minutesBetweenEggs * 60 * 1000)
    }

    /**
     * Récupère tous les oeufs en attente d'un utilisateur.
     * Renvoie le total des oeufs collectés.
     */
    async collectAllEggs(guildId: string, userId: string) {
        return await this.client.prisma.$transaction(async (tx) => {
            const userChickens = await this.getByUserAndGuild(guildId, userId, tx)
            
            let collectedEggs: CollectedEggs = []

            // Le filtre permet de ne collecter que les oeufs prêts à être récoltés
            await Promise.all(userChickens.filter(u => u.nextEggAt <= new Date()).map((userChicken) => {
                // Remplissage de l'info des oeufs collectés à renvoyer
                collectedEggs.push({
                    chicken: userChicken.chicken,
                    amount: userChicken.amount
                })

                // Ajout de la promise à la pile de promises
                return tx.userChickens.update({
                    data: { 
                        eggAmount: { increment: userChicken.amount },
                        nextEggAt: new Date(Date.now() + userChicken.chicken.minutesBetweenEggs * 60_000)
                    },
                    where: { 
                        userDiscordId_guildId_chickenId: { 
                            guildId, 
                            userDiscordId: userId, 
                            chickenId: userChicken.chickenId
                        }
                    }
                })
            }))

            return collectedEggs.sort((a, b) => b.chicken.value * b.amount - a.chicken.value - a.amount)
        })
    }
}