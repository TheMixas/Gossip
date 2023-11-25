import fs from "fs";
import {postsImagesDir} from "../app.js";
import {userAvatarsDir} from "../app.js";

/*
* @param path: string
* @param isAvatar: boolean
* @return array of base64 images
* */
export function readImagesFromPath(path = null, isAvatar = false)  {
    try{
        let pathsArray = []
        let dir = isAvatar ? userAvatarsDir : postsImagesDir
        let photos = []
        //Turn paths string into array
        if(path !== null){
            pathsArray = path.split(',')
        }
        //For each path, turn into base64 and push into array
        for (let j = 0; j < pathsArray.length; j++) {
            photos.push(fs.readFileSync(dir+pathsArray[j]).toString('base64'))
        }
        if(isAvatar){
            return photos[0]
        }else{
            return photos
        }
    }catch (e) {
        console.log("Encountered error while reading images: ",e)
    }

}
/*
* Returns the array passed in with the images appended to each post
* */
export function readAllPostsImages(posts){
    for (let i = 0; i < posts.length; i++) {
        console.log("i: ", i)
        //Append avatar photos
        posts[i].avatar = readImagesFromPath(posts[i].creator_avatarPath, true)
        // console.log("Avatar: ", posts.avatar)
        posts[i].creator_avatarPath = undefined


        //Append post photos
        posts[i].photos = readImagesFromPath(posts[i].post_image_paths, false)
        posts[i].post_image_paths = undefined

        if (posts[i].original_post_id) {
            // console.log("Original post avatarpath ", posts[i].original_creator_avatarPath)
            //Append original post avatar photos
            posts[i].original_avatar = readImagesFromPath(posts[i].original_creator_avatarPath, true)
            // console.log("Original avatar: ", posts[i].original_avatar)
            posts[i].original_avatarPath = undefined

            //Append original post photos
            posts[i].original_photos = readImagesFromPath(posts[i].original_image_paths, false)
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