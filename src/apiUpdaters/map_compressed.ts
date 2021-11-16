const fs = require('fs')
import {casesToHexGradient} from '../utils' 

export const map_compressed = (todayJson: {[index: string]:any}) => {
    const schema:any = JSON.parse(fs.readFileSync('./schemas/map_compressed.json', 'utf8'))
    // Iterate through map_compressed.json
    for (const feature of schema["features"]) {
        // Get the name of the city we currentyly at
        const name: string = feature["properties"]["name"]
        // Assume we dont have any cases
        let activeCases = 0
        // Check if we have it reported in our json
        if (name in todayJson["activeCases"]) {
            // Get reported active cases from our json
            activeCases = todayJson["activeCases"][name]
        }
        // Put them in our map_compressed.json
        feature["properties"]["amountActive"] = activeCases
        feature["properties"]["color"] = casesToHexGradient(activeCases)
    }
    
    fs.writeFileSync('./api/map_compressed.json', JSON.stringify(schema))
}