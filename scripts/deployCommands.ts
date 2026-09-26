import { REST, Routes, SlashCommandBuilder } from "discord.js"
import { config } from "../config"
import { readFilesAndForEach } from "../src/utils"

const commandBuilders: SlashCommandBuilder[] = []

// On récupère les SlashCommandBuilders
readFilesAndForEach("commands", (filePath) => {
    const builder = require(filePath).default
    if (builder instanceof SlashCommandBuilder) {
        commandBuilders.push(builder)
    }
})

const rest = new REST().setToken(config.botToken)

// Déploiement des commandes
rest.put(
    Routes.applicationCommands(config.botId),
    { body: commandBuilders.map(b => b.toJSON()) }
)
.then(() => console.log(`${commandBuilders.length} commande(s) mise(s) à jour.`))
.catch((err) => console.error("Une erreur a eu lieu lors de la mise à jour des commands.", err))
