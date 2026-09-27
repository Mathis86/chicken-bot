import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder } from "discord.js";
import ChickensState from "./Chickens.state";
import { CollectedEggs } from "../../services/Chicken.service";

export default function getChickensComponents(state: ChickensState) {
    // Calcul de la valeur totale de l'inventaire
    let totalValue = 0
    for (const userChicken of state.userChickens) {
        totalValue += userChicken.chicken.value * userChicken.amount
    }

    const container = new ContainerBuilder()
        .addSectionComponents(s => s
            .addTextDisplayComponents(t => t.setContent(`# Poules de ${state.userName}`))
            .addTextDisplayComponents(t => t.setContent(`### Valeur de l'inventaire → ${totalValue}`))
            .addTextDisplayComponents(t => t.setContent(`-# **Nom (Quantité)** → **Valeur totale**`))
            .setThumbnailAccessory(t => t.setURL(state.avatarUrl))
        )
        .addSeparatorComponents(s => s)

    // Trier par stack value
    const sortedUserChickens = state.userChickens.sort((a, b) => b.amount * b.chicken.value - a.amount * a.chicken.value)

    let canLootEggs = false
    for (const userChicken of sortedUserChickens) {
        const emojiId = userChicken.chicken.emojiId ? (userChicken.chicken.emojiId + " ") : ""
        const value = userChicken.chicken.value
        const stackValue = value * userChicken.amount

        // Gestion du temps restant avant le prochain oeuf
        const msBetweenEggs = userChicken.chicken.minutesBetweenEggs * 60 * 1000
        const msBeforeNextEgg = Math.max(userChicken.nextEggAt.getTime() - Date.now(), 0)
        const msSinceLastEgg = msBetweenEggs - msBeforeNextEgg
        const progressBar = getProgressBar(msSinceLastEgg, msBetweenEggs)

        let eggInfos = `-# ${userChicken.amount} oeuf${userChicken.amount > 1 ? "s" : ""} dans ${progressBar} ${formatTimeRemaining(msBeforeNextEgg)}`
        if (msBeforeNextEgg === 0) {
            eggInfos = `-# ${userChicken.amount} oeuf${userChicken.amount > 1 ? "s" : ""} prêt${userChicken.amount > 1 ? "s" : ""} ! ${progressBar}`
            canLootEggs = true
        }

        const textContent = `${emojiId}**${userChicken.chicken.name}** **(x${userChicken.amount})** → **${stackValue}**`
        container.addTextDisplayComponents(t => t.setContent(textContent + '\n' + eggInfos))
    }
    
    if (container.components.length > 40) throw new Error("La view de l'inventaire des poules dépasse 40 composants.")

    // Les boutons ne sont pas accessibles lors de la consultation de l'inventaire d'un autre joueur
    if (!state.isCommandAuthor) return [container]

    // Boutons
    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
            .setCustomId('eggs')
            .setEmoji('🥚')
            .setLabel('Récupérer tous les oeufs')
            .setStyle(!canLootEggs ? ButtonStyle.Secondary : ButtonStyle.Success)
            .setDisabled(!canLootEggs || state.expired),

        new ButtonBuilder()
            .setCustomId('refresh')
            .setEmoji('🔁')
            .setLabel('Rafraîchir')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(state.expired)
    )

    return [container, row]
}

export function getEggsComponent(collectedEggs: CollectedEggs) {
    if (collectedEggs.length === 0) return new ContainerBuilder()
        .addTextDisplayComponents(t => t.setContent(`## Tu n'as rien collecté.`))
    
    const container = new ContainerBuilder()
        .addTextDisplayComponents(t => t.setContent(`## Tu as collecté :`))
        .addSeparatorComponents(s => s)

    for (const collectedEgg of collectedEggs) {
        const { amount, chicken } = collectedEgg
        const chickenEmoji = chicken.emojiId ? (chicken.emojiId) + " " : ""
        container.addTextDisplayComponents(t => t.setContent(`${collectedEgg.amount} oeuf${amount > 1 ? "s" : ""} de ${chickenEmoji}**${chicken.name}**`))
    }

    return container
}

function getProgressBar(current: number, max: number) {
    const totalSquares = 10
    const fullSquares = Math.floor(totalSquares * current / max) 
    const emptySquares = totalSquares - fullSquares

    return '▰'.repeat(fullSquares) + '▱'.repeat(emptySquares)
}

function formatTimeRemaining(remainingMs: number): string {
    const totalSeconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) {
        return `${seconds} sec`;
    }

    return `${minutes} min`;
}