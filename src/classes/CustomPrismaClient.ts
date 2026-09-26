import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { config } from "../../config";
import { PrismaClient } from "../../prisma/generated/client";

export default class CustomPrismaClient extends PrismaClient {
    constructor() {
        const adapter = new PrismaMariaDb({
            host: config.dbHost,
            user: config.dbUser,
            password: config.dbPass,
            database: config.dbName,
            allowPublicKeyRetrieval: true
        })

        super({ adapter })
    }
}