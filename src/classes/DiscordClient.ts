import { ChatInputCommandInteraction, Client, Collection, GatewayIntentBits, PermissionFlagsBits } from "discord.js";

import Command from "./Command";
import CustomPrismaClient from "./CustomPrismaClient";
import ChickenService from "../services/Chicken.service";
import ChickenSpawnScheduler from "../ChickenSpawn.scheduler";
import { readFilesAndForEach } from "../utils";
import Event from "./Event";
import RegisteredChannelService from "../services/RegisteredChannels.service";
import MessageService from "../services/Message.service";
import SpawnService from "../services/Spawn.service";

export default class DiscordClient extends Client {
    commands: Collection<string, Command> = new Collection()
    prisma: CustomPrismaClient

    services: { 
        chicken: ChickenService
        registeredChannel: RegisteredChannelService
        message: MessageService,
        spawn: SpawnService
    }

    chickenSpawnScheduler: ChickenSpawnScheduler

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        this.prisma = new CustomPrismaClient()
        this.services = {
            chicken: new ChickenService(this),
            registeredChannel: new RegisteredChannelService(this),
            message: new MessageService(this),
            spawn: new SpawnService(this)
        }

        this.chickenSpawnScheduler = new ChickenSpawnScheduler(this)
    }

    /**
     * Charge toutes les commandes dans une Collection pour handler les interactionCreate
     */
    loadCommands() {
        readFilesAndForEach('commands', (filePath) => {
            const commandClass = require(filePath).default
            if (!(commandClass.prototype instanceof Command)) return
            
            const command = new commandClass()
            if (command instanceof Command) {
                this.commands.set(command.name, command)
            }
        })
    }

    /**
     * Ecoute tous les events
     */
    loadEvents() {
        readFilesAndForEach('events', (filePath) => {
            const eventClass = require(filePath).default
            if (!(eventClass.prototype instanceof Event)) return

            const event = new eventClass()
            if (event instanceof Event) {
                if (event.once) this.once(event.name, (...args) => event.execute(this, ...args).catch(console.error))
                else this.on(event.name, (...args) => event.execute(this, ...args).catch(console.error))
            }            
        })
    }

    /**
     * Execute une commande en fonction d'une ChatInputCommandInteraction reçue.
     * Ne fait rien si la commande n'existe pas.
     */
    tryToExecuteCommand(interaction: ChatInputCommandInteraction) {
        const commandName = interaction.commandName + (interaction.options.getSubcommand() ? '.' + interaction.options.getSubcommand() : '')
        
        const command = this.commands.get(commandName)
        if (!command) return

        if (command.isAdmin && !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            interaction.reply("C'est une commande admin et visiblement t'es pas admin\n-# *C'est peut-être le moment de soudoyer l'owner...*")
                .catch(console.error)
            return
        }

        command.execute(this, interaction).catch(console.error)
    }
}