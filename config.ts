import dotenv from "dotenv"
dotenv.config()

const dbHost = process.env.DB_HOST || ""
const dbUser = process.env.DB_USER || ""
const dbPass = process.env.DB_PASS || ""
const dbName = process.env.DB_NAME || ""
const dbUrl = `mysql://${dbUser}:${dbPass}@${dbHost}:3306/${dbName}`

export const config = {
    botToken: process.env.BOT_TOKEN || "",
    botId: process.env.BOT_ID || "",
    dbHost, dbUser, dbPass, dbName, dbUrl,
    isProd: process.env.NODE_ENVIR === "PROD" ? true : false
}