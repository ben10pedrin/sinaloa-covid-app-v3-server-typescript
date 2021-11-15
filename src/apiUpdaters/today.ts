const fs = require('fs')
import {casesToHexGradient, similarity} from '../utils' 

export const today = (todayJson: {[index: string]:any}) => {
    const schema:any = JSON.parse(fs.readFileSync('./schemas/today.json', 'utf8'))

    // Exact copy
    schema["dateStr"] = todayJson["dateStr"]
    schema["globalNewDeaths"] = todayJson["globalNewDeaths"]
    schema["globalNewCases"] = todayJson["globalNewCases"]

    // Traffic Light Validation
    const trafficLight:string|null = todayJson["trafficLight"]

    schema["trafficLight"]["name"] = trafficLight

    let trafficLightColor:string|null = null
    // Prevent crashing similarity when no traffic light name
    if (trafficLight != null) {
        if (similarity(trafficLight, "Verde") > 0.7) trafficLightColor = "#00FF00";
        if (similarity(trafficLight, "Amarillo") > 0.7) trafficLightColor = "#FFFF00";
        if (similarity(trafficLight, "Rojo") > 0.7) trafficLightColor = "##FF0000";
    }

    schema["trafficLight"]["color"] = trafficLightColor

    // newCases
    getNewCasesOrDeaths("newCases", todayJson, schema)

    // newDeaths
    getNewCasesOrDeaths("newDeaths", todayJson, schema)
    
    fs.writeFileSync('./api/today.json', JSON.stringify(schema, null, 4))
}

const getNewCasesOrDeaths = (option: string, todayJson: {[index: string]:any}, schema: any) => {
    // Prevent from crashing when there are no newCases
    if (todayJson[option] != null) {
        // If there are new cases, create an array
        schema["cities"][option] = []
        // Iterate through today's json new cases dictionary (key, value) => (cityName, cityNewCases/Deaths)
        for (const key in todayJson[option]) {
            // Append city objecy with color
            const value = todayJson[option][key]
            schema["cities"][option].push({
                "name": key,
                [option]: value,
                "color": casesToHexGradient(todayJson["activeCases"][key])
            })
        }
    }
}