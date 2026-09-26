import { config } from "../config";
import DiscordClient from "./classes/DiscordClient";

const client = new DiscordClient()

// Récupérer toutes les commandes
client.loadCommands()
client.loadEvents()

client.login(config.botToken)