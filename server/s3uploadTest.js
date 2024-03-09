import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import fs from "fs";
dotenv.config();
const s3 = new AWS.S3();

const uploadToS3 =async() => {

    //if

    // Specify the path to the image file
    let imagePath = './user_images/defaultAvatar.png';
    let imageData = fs.readFileSync(imagePath);

    await s3.putObject({
        Body: imageData, // Use the imageData
        Bucket: 'gossip-file-server',
        Key: 'defaultAvatar.jpg'
    }).promise()
}

const getFromS3 = async() => {
    try{
        let params = {
            Bucket: 'gossip-file-server',
            Key: 'defaultAvatar.jpg'
        }
        return new Promise((resolve, reject) => {
            s3.getObject(params, function (err, data) {
                if (err) {
                    console.log("Encountered error while reading from s3: ", err)
                    reject(err)
                } else {
                    console.log(`File read successfully. Metadata:${Object.keys(data.Metadata)}`);
                    resolve(data)
                }
            })
        })
    }
    catch (e) {
        console.log("Error: ", e)
    }
    
}

const downloadFromS3 = async() => {
    let value
    await getFromS3()
        .then((data) => {
            console.log("Data: ", data)
            fs.writeFileSync('defaultAvatar.jpg', data.Body)
            value = 'good'
        })
        .catch((e) => {
            console.log("Error in downloadfroms3: ", e)
            value = 'bad'
        })
    return value

}
console.log(await downloadFromS3())