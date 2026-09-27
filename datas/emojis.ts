import { config } from "../config"

const EmojisProd = {
    WhiteChicken: "<:white:1553139534282231828>",
    OrangeChicken: "<:orange:1553139531874570272>",
    RichChicken: "<:rich:1553139533070204950>",
    GoldChicken: "<:gold:1553139530687578242>",
    BlackHoleChicken: "<:blackhole:1553375080975826994>"
}

const EmojisDev = {
    WhiteChicken: "<:white:1553139534282231828>",
    OrangeChicken: "<:orange:1553139531874570272>",
    RichChicken: "<:rich:1553139533070204950>",
    GoldChicken: "<:gold:1553139530687578242>",
    BlackHoleChicken: "<:blackhole:1553375080975826994>"
}

const emojis = config.isProd ? EmojisProd : EmojisDev

export default emojis