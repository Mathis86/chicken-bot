import { config } from "../config";
import chickensProd from "./chickens.prod"
import chickensDev from "./chickens.dev"

const chickens = config.isProd ? chickensProd : chickensDev

export default chickens