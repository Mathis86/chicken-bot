import { Chickens } from "../prisma/generated/client"

const chickens: Chickens[] = [
    {
        id: 1,
        name: "Poule blanche",
        value: 10,
        imageName: "white",
        emojiId: "<:white:1553139534282231828>",
        minutesBetweenEggs: 60
    },
    {
        id: 2,
        name: "Poule rousse",
        value: 12,
        imageName: "orange",
        emojiId: "<:orange:1553139531874570272>",
        minutesBetweenEggs: 60
    },
    {
        id: 3,
        name: "Poule rich millionnaire",
        value: 20,
        imageName: "rich",
        emojiId: "<:rich:1553139533070204950>",
        minutesBetweenEggs: 60
    },
    {
        id: 4,
        name: "Poule dorée",
        value: 30,
        imageName: "gold",
        emojiId: "<:gold:1553139530687578242>",
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
        emojiId: "<:blackhole:1553375080975826994>",
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