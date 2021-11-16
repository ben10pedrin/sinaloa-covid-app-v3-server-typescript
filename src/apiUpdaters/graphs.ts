const fs = require('fs')
import { RIGHT_NAMES, jsonFilenameToDate, capitalizeFirstLetter, formatHumanDate } from "../utils"

export const graphs = (cachedJsons: {[index: string]:any}) => {
    const graphsSingle:any = JSON.parse(fs.readFileSync('./schemas/graphsSingle.json', 'utf8'))
    const schema: any = {
        "names": RIGHT_NAMES
    }

    for(const name of RIGHT_NAMES) {
        // Deep Clone of our blueprint for each city
        schema[name] = JSON.parse(JSON.stringify(graphsSingle));
    }
    // Deep Clone of our blueprint for the state
    schema["Estatal"] = JSON.parse(JSON.stringify(graphsSingle));

    // Sort the filenames available in jsons folder ordered by date ascending
    const filenamesInFolder:Array<string> = fs.readdirSync('./jsons')
    filenamesInFolder.sort((a, b) => {
        const dateA = jsonFilenameToDate(a);
        const dateB = jsonFilenameToDate(b);
        return (dateA as any) - (dateB as any);
    })
    // Iterate through massive json cache
    for (const jsonFilename of filenamesInFolder) {
        const date = jsonFilename.split('.')[0]
        // Push to the array for every city
        for(const name of RIGHT_NAMES) {
            pushCityNewCasesOrNewDeaths("newCases", name, date, cachedJsons, schema)
            pushCityNewCasesOrNewDeaths("newDeaths", name, date, cachedJsons, schema)
        }
        // Push to estatal the global amounts
        pushEstatalCasesOrDeaths("newCases", "Estatal", date, cachedJsons, schema)
        pushEstatalCasesOrDeaths("newDeaths", "Estatal", date, cachedJsons, schema)
    }

    fs.writeFileSync('./api/graphs.json', JSON.stringify(schema))
}

const pushCityNewCasesOrNewDeaths = (option:string, name:string, date: string, cachedJsons: {[index: string]:any}, schema:any ) => {
    // Assume amount is zero
    let amount = 0
    // If cachedJsons of newCases or newDeaths exists and name is present in that json, get the amount
    if(cachedJsons[date][option] != null && name in cachedJsons[date][option])
        amount = cachedJsons[date][option][name];
    // Push the amount to our array
    schema[name][option]["datasets"][0]["data"].push(amount)
    // Take care of the maximum
    const location = schema[name]["max"+capitalizeFirstLetter(option)]
    if(amount>=location["amount"]){
        location["amount"] = amount
        location["date"] = formatHumanDate(date)
    }
}

const pushEstatalCasesOrDeaths = (option:string, name:string, date: string, cachedJsons: {[index: string]:any}, schema:any) => {
    const amount = cachedJsons[date]["global"+capitalizeFirstLetter(option)]
    schema[name][option]["datasets"][0]["data"].push(amount)

    const location = schema[name]["max"+capitalizeFirstLetter(option)]
    if(amount>=location["amount"]){
        location["amount"] = amount
        location["date"] = formatHumanDate(date)
    }
}