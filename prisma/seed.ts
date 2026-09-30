import chickens from "../datas/chickens"
import quests from "../datas/quests"
import CustomPrismaClient from "../src/classes/CustomPrismaClient"

const prisma = new CustomPrismaClient()

async function main() {
    // CHICKENS
    for (const chicken of chickens) {
        await prisma.chickens.upsert({
            create: chicken, update: chicken, where: { id: chicken.id }
        })
    }

    // QUESTS
    for (const quest of quests) {
        await prisma.quests.upsert({
            create: quest, update: quest, where: { id: quest.id }
        })
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())