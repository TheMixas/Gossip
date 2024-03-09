import fs from "fs";
import {messageImagesDir} from './app.js'
import {uploadToS3} from "./utils/s3-utils.js";

export async function storeFile(body) {
    //INFO: RETURNS -> fileName
    //NOTE: initialize date tools
    let date_ob = new Date();

    //NOTE: STEP 1 -> store file in server
    //NOTE: STEP 2 -> store file path in database
    let base64Image = body.split(';base64,').pop();
    let nameRandomizer = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    let fileName = date_ob.getTime() + nameRandomizer + ".png"
    let filePath = messageImagesDir+`${fileName}`
    try {
        /*
        let base64Image = body.split(';base64,').pop();
let buffer = Buffer.from(base64Image, 'base64');
        * */
        let buffer = Buffer.from(base64Image, 'base64');
        const file = {
            buffer,
        }
        console.log("buffer: ", buffer)
        await uploadToS3(file, fileName)
        // await fs.writeFileSync(filePath, base64Image, {encoding: 'base64'})

    } catch (e) {
        console.log("error storing file: ", e)
    }
    return fileName
}