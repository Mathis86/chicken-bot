import { Quests } from "../prisma/generated/client";

const quests: Quests[] = [
    {
        id: 1,
        descriptionFr: "Capture 5 poules",
        descriptionEn: "Catch 5 chickens",
        target: 5,
        xp: 300,
        frequency: "DAILY"
    },
    {
        id: 2,
        descriptionFr: "Récupère tes oeufs 3 fois",
        descriptionEn: "Collect your eggs 3 times",
        target: 3,
        xp: 350,
        frequency: "DAILY"
    },
    {
        id: 3,
        descriptionFr: "Capture une poule en moins de 5 secondes 3 fois",
        descriptionEn: "Catch a chicken in 5 seconds 3 times",
        target: 3,
        xp: 450,
        frequency: "DAILY"
    },
    {
        id: 4,
        descriptionFr: "Capture une poule rare",
        descriptionEn: "Catch a rare chicken",
        target: 1,
        xp: 500,
        frequency: "DAILY"
    },
]

export default quests