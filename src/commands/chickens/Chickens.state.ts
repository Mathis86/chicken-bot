import { ChatInputCommandInteraction, User } from "discord.js";
import { UserChickensGetPayload } from "../../../prisma/generated/models";

export default class ChickensState {
    userName: string
    avatarUrl: string
    isCommandAuthor: boolean

    constructor(
        interaction: ChatInputCommandInteraction,
        user: User,
        public userChickens: UserChickensGetPayload<{ include: { chicken: true } }>[]
    ) {
        this.userName = user.displayName
        this.avatarUrl = user.displayAvatarURL()
        this.isCommandAuthor = user.id === interaction.user.id
    }

    collectEggs() {
        let totalEggs = 0
        for (const userChicken of this.userChickens) {
            userChicken.nextEggAt = new Date(Date.now() + userChicken.chicken.minutesBetweenEggs * 60_000)
            totalEggs += userChicken.amount
        }
        return totalEggs
    }
}