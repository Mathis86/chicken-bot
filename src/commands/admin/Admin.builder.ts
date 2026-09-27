import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName('admin')
    .setDescription("Toutes les commandes que seuls les admins peuvent utiliser")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(opt => opt
        .setName('setup')
        .setDescription("Définis le salon actuel comme l'endroit où vont apparaître les poules")
    )
    .addSubcommand(opt => opt
        .setName('forget')
        .setDescription("Arrête de faire spawn les poules dans ce salon")
    )