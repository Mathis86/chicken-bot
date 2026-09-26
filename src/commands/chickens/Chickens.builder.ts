import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName('chickens')
    .setDescription("Affiche ton inventaire de poules")
    .addUserOption(opt => opt
        .setName('joueur')
        .setDescription(`Pour voir l'inventaire d'un autre joueur`)
        .setRequired(false)
    )