import chickens from "../datas/chickens"
import CustomPrismaClient from "../src/classes/CustomPrismaClient"

const prisma = new CustomPrismaClient()

async function main() {
    for (const chicken of chickens) {
        await prisma.chickens.upsert({
            create: chicken,
            update: chicken,
            where: { id: chicken.id }
        })
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())