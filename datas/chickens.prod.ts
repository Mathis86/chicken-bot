import { Chickens } from "../prisma/generated/client"

const chickens: Chickens[] = [
    {
        id: 1,
        name: "Poule blanche",
        value: 10,
        imageName: "white",
        emojiId: "<:white:1553517936105357362>",
        minutesBetweenEggs: 60
    },
    {
        id: 2,
        name: "Poule rousse",
        value: 12,
        imageName: "orange",
        emojiId: "<:orange:1553517934163271781>",
        minutesBetweenEggs: 60
    },
    {
        id: 3,
        name: "Poule rich millionnaire",
        value: 20,
        imageName: "rich",
        emojiId: "<:rich:1553517935149064242>",
        minutesBetweenEggs: 60
    },
    {
        id: 4,
        name: "Poule dorée",
        value: 30,
        imageName: "gold",
        emojiId: "<:gold:1553517932800380989>",
        minutesBetweenEggs: 60
    },
    {
        id: 5,
        name: "Poule galaxie",
        value: 50,
        imageName: null,
        emojiId: null,
        minutesBetweenEggs: 60
    },
    {
        id: 6,
        name: "Poule trou noir",
        value: 100,
        imageName: "blackhole",
        emojiId: "<:blackhole:1553517929918636062>",
        minutesBetweenEggs: 60
    },
    {
        id: 7,
        name: "Poule divine",
        value: 200,
        imageName: null,
        emojiId: null,
        minutesBetweenEggs: 60
    }
]

export default chickens