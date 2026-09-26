import path from 'path'
import fs from 'fs'
import { AttachmentBuilder } from 'discord.js'

export function readFilesAndForEach(folder: string, callback: (filePath: string) => void) {
    const filesPath = path.join(process.cwd(), "src", folder)
    const files = fs.readdirSync(filesPath, {
        recursive: true, 
        encoding: 'utf-8'
    }).filter(f => f.endsWith(".ts"))
    
    for (const file of files) callback(path.join(filesPath, file))
}

export function getAttachmentByImagename(name: string): AttachmentBuilder {
    return new AttachmentBuilder(path.join(process.cwd(), 'images', `${name}.png`))
}