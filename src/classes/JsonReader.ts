const fs = require('fs')

export class JsonReader {
    cachedJsons: {[index: string]:any};

    constructor() {
        this.cachedJsons = {}
    }

    read() {
        const filenamesInFolder = fs.readdirSync('./jsons')
        for (const jsonFilename of filenamesInFolder) {
            const date = jsonFilename.split('.')[0]
            this.cachedJsons[date] = JSON.parse(fs.readFileSync('./jsons/'+jsonFilename, 'utf8'))
        }
        return this.cachedJsons
    }
}