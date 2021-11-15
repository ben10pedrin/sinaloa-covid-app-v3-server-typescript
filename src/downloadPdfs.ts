const fs = require('fs')
const axios = require('axios');
const PdfParser = require('pdf-parse');
import {PdfExtractor} from './classes/PdfExtractor'

import {formatUnderscoreDate, URL_PREFIX} from "./utils"

export const downloadPdfs = async (NUMBER_OF_PDFS: number) => {
    const today = new Date()
    // Always increasing counter and succesfully downloaded counter
    let i = 0
    let successfulDownloads = 0
    // Download exactly the pdfs available and sotre the names
    let downloadedFiles: {[index: string]: boolean} = {}
    while(successfulDownloads < NUMBER_OF_PDFS){
        // Get date 
        const delayedDate = new Date();
        delayedDate.setDate(today.getDate() - i);
        
        // Get get filename 
        const filename = formatUnderscoreDate(delayedDate)
        const jsonFilename = filename+'.json'

        // Add to dictionary if downloaded
        const boolResult = await downloadSinglePdf(jsonFilename, filename)
        if(boolResult){
            downloadedFiles[jsonFilename] = true
        }

        // Increase counters
        console.log(boolResult)
        successfulDownloads+=boolResult ? 1 : 0
        i+=1
    }

    // Call to remove unused pdfs
    removeUnusedJsons(downloadedFiles)
    return downloadedFiles
}

const downloadSinglePdf = async (jsonFilename: string, filename: string): Promise<boolean> => {
    // Print the state
    const pdfFileName = filename+'.pdf'
    process.stdout.write('Downloading '+pdfFileName+' ... ')

    // If file already downloaded, exit and return True
    if (fs.existsSync('./jsons/'+jsonFilename)) {
        return true
    }

    // If folder does not exist, create it
    if(!fs.existsSync('./jsons/')){
        fs.mkdirSync('./jsons')
    }

    try {
        const res = await axios({
            method: 'get',
            url: URL_PREFIX + pdfFileName,
            responseType: 'arraybuffer',
          });
        const pdfJson = await pdfToJson(res.data, filename)
        fs.writeFileSync('./jsons/'+jsonFilename, pdfJson)
        return true
    } catch (error) {
        return false
    }
}

const pdfToJson = async (rawContent: ArrayBuffer, filename: string) => {
    // Put pdf in memory
    const pdfFile = await PdfParser(rawContent);

    // Remove duplicated spaces
    const text = pdfFile.text.split(/\s+/).join(" ").replace('', '🚨').replace('', '🚨')

    //Create a extractor instance
    const extractor = new PdfExtractor(text, filename)

    // Return json formatted
    return JSON.stringify(extractor.getOutputJson(),null,4)
}

const removeUnusedJsons = (downloadedFiles: {[index: string]: boolean}) => {
    //Print the state
    console.log('=======================')
    console.log('Removing unused pdfs...')

    //Get list of existant filenames
    const filenamesInFolder = fs.readdirSync('./jsons')

    //If they are not in our dictionary, then remove them
    for (const jsonFilename of filenamesInFolder) {
        if (!(jsonFilename in downloadedFiles)) {
            fs.unlinkSync('./jsons/'+jsonFilename)
        }
    }
}