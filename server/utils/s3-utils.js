import AWS from 'aws-sdk';
import {SetToCache} from "./cache-utils.js";
import {incrementS3GetCount, incrementS3PutCount, receiveS3GetCount, receiveS3PutCount} from "../db/s3-stats-db.js";

const s3 = new AWS.S3();


// name is the name of the file, it should be unique and the same as in db
//file.Body is the buffer of the file
export async function uploadToS3(file, name) {
    try {
        if (process.env.NODE_ENV === "development") {
            throw new Error("S3 upload not allowed in development")
        }
        const currentS3PutCount = await receiveS3PutCount()
        if (currentS3PutCount > process.env.MONTHLY_S3_PUT_LIMIT) {
            throw new Error("Monthly S3 put limit reached")
        }

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: name,
            Body: file.buffer,
            ContentType: file.mimetype ?? "image/jpeg",
        };
        console.log(`uploading ${name} file with params: `, params)
        await incrementS3PutCount()

        await s3.upload(params, function (err, data) {
            if (err) {
                console.log("Encountered error while uploading to s3: ")
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            const time = 60 * 60 * 24 //24 hours
            SetToCache(name, file.buffer, time).then((reply) => {
                console.log("cached upload")
            }).catch((e) => {
                console.log("Encountered error while caching: ", e)
            })
        })
    }
    catch (e) {
        console.log("s3-utils.js uploadToS3 error: ", e)
    }
}
//returns a promise
//might throw error , use catch block
//wil try to cache the file if its found
export async function getFromS3AndCacheIt(name) {

    if(process.env.NODE_ENV === "development"){
        throw new Error("S3 get not allowed in development")
    }
    const currentS3GetCount = await receiveS3GetCount()
    if(currentS3GetCount > process.env.MONTHLY_S3_GET_LIMIT){
        throw new Error("Monthly S3 get limit reached")
    }
    console.log("getFromS3 name: ", name)
    try{
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: name
        };
        return new Promise(async (resolve, reject) => {
            //check that name is a string
            if (typeof name !== 'string') {
                reject("name is not a string")
                return
            }
            console.log("reading from s3: name: ", name)
            await incrementS3GetCount()
            s3.getObject(params, function (err, data) {
                if (err) {
                    console.log("Encountered error while reading from s3: name: ", name)
                    reject(err)
                } else {
                    console.log(`File read successfully. key: ${name}`);
                    //cache the file
                    const time = 60 * 60 * 24 //24 hours
                    SetToCache(name, data.Body, time).then((reply) => {
                        console.log("cached")
                    }).catch((e) => {
                        console.log("Encountered error while caching: ", e)
                    })
                    resolve(data)
                }
            })
        })
    }catch (e) {
        console.log("s3-utils.js getFromS3 error: ", e)
    }


}

export async function deleteFromS3(name) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: name
    };
    await s3.deleteObject(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File deleted successfully. ${data.Location}`);
    })
}