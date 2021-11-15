import { formatUnderscoreDate } from "./utils"
import { JsonReader } from "./classes/JsonReader"
import { map_compressed } from "./apiUpdaters/map_compressed"
import { today } from "./apiUpdaters/today"
import { graphs } from "./apiUpdaters/graphs"
const fs = require('fs')

export const updateApi = () => {
    // Cache Jsons into a big dictionary
    const cachedJsons: {[index: string]:any} = new JsonReader().read()

    // Separate today's Json
    const todayJson = cachedJsons[formatUnderscoreDate(new Date())]

    // Delete api folder if existant
    if(fs.existsSync('./api/')) {
        fs.rmSync('./api/', { recursive: true });
    }

    // Create a fresh temporary api folder
    fs.mkdirSync('./api')

    // Git init stuff

    // Actual updates
    console.log('=======================')
    console.log('Updating map_compressed...')
    map_compressed(todayJson)

    console.log('=======================')
    console.log('Updating today...')
    today(todayJson)
    
    console.log('=======================')
    console.log('Updating graphs...')
    graphs(cachedJsons)
}