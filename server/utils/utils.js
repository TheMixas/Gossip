import fs from "fs";
import {postsImagesDir} from "../app.js";
import {userAvatarsDir} from "../app.js";
import {getFromS3AndCacheIt} from "./s3-utils.js";
import {GetFromCache} from "./cache-utils.js";

/*
* @param path: string
* @param isAvatar: boolean
* @return array of base64 images
* */
export async function readImagesFromPath(path = null, isAvatar = false) {
    try {
        let pathsArray = []
        let photos = []
        //Turn paths string into array
        if (path !== null) {
            pathsArray = path.split(',')
        }
        //For each path, turn into base64 and push into array
        for (let j = 0; j < pathsArray.length; j++) {
            let photo = await GetImageSafely(pathsArray[j])
            photos.push(
                photo.toString('base64')
                // fs.readFileSync(dir+pathsArray[j]).toString('base64')
            )
        }
        if (isAvatar) {
            return photos[0]
        } else {
            return photos
        }
    } catch (e) {
        console.log("Encountered error while reading images: ", e)
    }

}
/*
* Returns the array passed in with the images appended to each post
* */
export async function readAllPostsImages(posts) {
    for (let i = 0; i < posts.length; i++) {
        console.log("i: ", i)
        //Append avatar photos
        posts[i].avatar = await GetAvatarSafely(posts[i].creator_avatarPath)
        // console.log("Avatar: ", posts.avatar)
        posts[i].creator_avatarPath = undefined


        //Append post photos
        console.log("Post image paths: ", posts[i].post_image_paths)
        posts[i].photos = await readImagesFromPath(posts[i].post_image_paths, false)
        posts[i].post_image_paths = undefined

        if (posts[i].original_post_id) {
            // console.log("Original post avatarpath ", posts[i].original_creator_avatarPath)
            //Append original post avatar photos
            console.log("Original avatar path: ", posts[i].original_creator_avatarPath)
            posts[i].original_avatar = await readImagesFromPath(posts[i].original_creator_avatarPath, true)
            // console.log("Original avatar: ", posts[i].original_avatar)
            posts[i].original_avatarPath = undefined

            //Append original post photos
            console.log("Original post image paths: ", posts[i].original_image_paths)
            posts[i].original_photos = await readImagesFromPath(posts[i].original_image_paths, false)
            posts[i].original_image_paths = undefined
        }

    }
    return posts
}
//Appends user avastar and banner
// export function readMiniProfile(user){
//     user.avatar = readImagesFromPath(user.avatarPath, true)
//     user.avatarPath = undefined
//     user.banner = readImagesFromPath(user.bannerPath, true)
//     user.bannerPath = undefined
//     return user
// }

//functions below are used to get images safely, returning a default image if the image is not found
export async function GetAvatarSafely(avatarPath) {
    let avatar = undefined
    console.log("Getting avatar safely: ", avatarPath)

    //check cache for avatar
    await GetFromCache(avatarPath).then((data) => {
        avatar = data.toString("base64")
    }).catch((e) => {
        console.log("Get from cache failed: ", e)
    })
    if(avatar !== undefined){
        console.log("Avatar found in cache")
        return avatar
    }


    await getFromS3AndCacheIt(avatarPath)
        .then((data) => {
            avatar = data.Body.toString("base64")
        })
        .catch((e) => {
            console.log("Error in getAvatarSafely, returning default avatgar: ")
            avatar = fs.readFileSync(userAvatarsDir + "defaultAvatar.png").toString("base64")
        })
    return avatar
}

export async function GetBannerSafely(bannerPath) {
    let banner = undefined
    console.log("Getting banner safely: ", bannerPath)

    await GetFromCache(bannerPath).then((data) => {
        banner = data.toString("base64")
    }).catch((e) => {
        console.log("Get from cache failed: ", e)
    })
    if(banner !== undefined){
        return banner
    }
    await getFromS3AndCacheIt(bannerPath)
        .then((data) => {
            banner = data.Body.toString("base64")
        })
        .catch((e) => {
            console.log("Error in getBannerSafely, returning default avatgar: ")
            banner = fs.readFileSync(userAvatarsDir + "defaultBanner.jpg").toString("base64")
        })
    return banner
}
export async function GetImageSafely(imagePath) {
    let image = undefined

    console.log("Getting image safely: ", imagePath)


    await GetFromCache(imagePath).then((data) => {
        image = data.toString("base64")
    }).catch((e) => {
        console.log("Get from cache failed: ", e)
    })
    if(image !== undefined){
        return image
    }
    await getFromS3AndCacheIt(imagePath)
        .then((data) => {
            image = data.Body.toString("base64")
        })
        .catch((e) => {
            console.log("Error in getPostImageSafely, returning default avatgar: ")
            image = fs.readFileSync( postsImagesDir+ "defaultImage.png").toString("base64")
        })
    return image
}