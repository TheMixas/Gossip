import express from "express";

const router = express.Router()
import {
    createPost,
    getFriendsPosts, getPost, getPostComments,
    getPostPhotosPaths, getPostRecentLikers,
    getPostStats,
    likePost, unlikePost
} from "../db/post-db.js";
import {getUserById} from "../db/user-db.js";

import {checkToken, verifyToken} from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import * as fs from "fs";
import {userAvatarsDir,postsImagesDir} from "../app.js";
import FormData from "form-data";
import {getHottestPosts} from "../db/big-queries/queryHottestPosts.js";
function fileFilter (req, file, cb) {

    
    if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg'){
        
        cb(null, false)
    }else{
        
        cb(null, true)
    }
}
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'user_posts_images/')
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
        }
        // You can always pass an error if something goes wrong:
        // cb(new Error('I don\'t have a clue!'))

    }
)
const upload = multer({storage, fileFilter})



router.post('/posts/friendPosts', verifyToken, async (req,res) =>{
    console.log("received request at /posts/friendPosts")
    const {limit = 10,offset =0} = req.body
    try{
        const posts = await getFriendsPosts(req.user.id, limit, offset)
        
        //for each post, get the user
        for (const post of posts) {
            post.username = (await getUserById(post.creator_user_id)).username
            post.creator_user_id = undefined
        }
        //body,username

        return res.status(200).send(posts)
    }catch(e){
        
        return res.status(500).send(e)
    }

})

//posts/hot posts | non auth
router.get('/posts/hottestPosts', checkToken,async (req,res) =>{

    let hPosts;
    const {limit = 200,offset =0} = req.body
    try{

        hPosts = await getHottestPosts(req.user.id ?? null,offset,limit)
        //For eaach post, turn photo paths, orginal post photo paths, creator avatar and banner paths into base64
        for (let i = 0; i < hPosts.length; i++) {
            let pathsArray = []
            let pathsString = hPosts[i].post_image_paths ?? null
            let postPhotos = []
            //Turn paths string into array
            if(pathsString !== null){
                pathsArray = pathsString.split(',')
            }
            //For each path, turn into base64 and push into array
            for (let j = 0; j < pathsArray; j++) {
                postPhotos.push(fs.readFileSync(postsImagesDir+pathsArray[j]).toString('base64'))
            }
            //orginal post photos
            pathsArray = []
            pathsString = hPosts[i].original_image_paths ?? null
            let originalPostPhotos = []
            //Turn paths string into array
            if(pathsString !== null){
                pathsArray = pathsString.split(',')
            }
            //For each path, turn into base64 and push into array
            for (let j = 0; j < pathsArray; j++) {
                originalPostPhotos.push(fs.readFileSync(postsImagesDir+pathsArray[j]).toString('base64'))
            }

            //creator avatar
            let avatarPath = hPosts[i].creator_avatarPath ?? null
            let avatarPhoto = null
            if(avatarPath !== null){
                avatarPhoto = fs.readFileSync(userAvatarsDir+avatarPath).toString('base64')
            }

            //original post creator avatar
            let originalAvatarPath = hPosts[i].original_creator_avatarPath ?? null
            let originalAvatarPhoto = null
            if(originalAvatarPath !== null){
                originalAvatarPhoto = fs.readFileSync(userAvatarsDir+originalAvatarPath).toString('base64')
            }

            //finally append photo arrays to post object and remove paths
            hPosts[i].photos = postPhotos
            hPosts[i].originalPhotos = originalPostPhotos
            hPosts[i].post_image_paths = undefined
            hPosts[i].original_image_paths = undefined

            hPosts[i].avatar = avatarPhoto
            hPosts[i].original_avatar = originalAvatarPhoto
            hPosts[i].creator_avatarPath = undefined
            hPosts[i].original_creator_avatarPath = undefined
        }
        // console.log("sending hjPosts: ",hPosts)



        //set header object
        res.setHeader("Content-Type", "application/json");
        return res.status(200).send({hPosts})
    }catch(e){
        res.status(500).send(e)
    }

})

//like a post
router.post('/posts/like', verifyToken, async (req,res) =>{
    try{
        const {postId} = req.body
        await likePost(postId,req.user.id)
        return res.status(200).send("post liked")
    }catch (e){
         console.log("error while liking post: ",e)
        return res.status(500).send(e)
    }
})

//unlike a post
router.post('/posts/unlike', verifyToken, async (req,res) =>{
    try{
        
        
        const {postId} = req.body
        await unlikePost(postId,req.user.id)
        return res.status(200).send("post unliked")
    }catch (e){
        
        return res.status(500).send(e)
    }
})

//get post
router.get('/posts/getPost/:id', checkToken,async (req,res) =>{
    //return post based on postid in req.body
    //TODO: make get post a function
    try{
        
        
        const {id} = req.params
//print req.params
        const post = await getPost(id,req.user?.id)
        //get photos
        const photosPaths = await getPostPhotosPaths(id)
        //get photos from paths
        let postPhotos = []//object with photo nr as key and photo as value
        for (let i = 0; i < photosPaths.length; i++) {
            postPhotos.push(fs.readFileSync(postsImagesDir+photosPaths[i].image_path).toString('base64'))
        }
        post.photos = postPhotos
        //get stats
        post.stats = await getPostStats(id)
        //get creator username and name and append
        let {username,name,avatarPath} = await getUserById(post.creator_user_id)
        post.username = username
        post.name = name
        post.avatar =  fs.readFileSync(userAvatarsDir+avatarPath).toString('base64')
        return res.status(200).send(post)

    }
    catch (e){
        
        return res.status(500).send(e)
    }
})

//Returns post comments with photos
// * Params:
// * <ul>
// * <li>postId</li>
// * <li>limit</li>
// * <li>offset</li>
// * </ul>
// * Returns an array of comments
// * <h1> Comment object: </h1>
// * <ul>
// * <li>post_id</li>
// * <li>post_body</li>
// * <li>post_creator_id</li>
// * <li>post_created_at</li>
// * <li>post_likes</li>
// * <li>post_creator_username</li>
// * <li>post_creator_name</li>
// * <li>post_creator_avatar</li>
// * <li>photos</li>
// * <li>comment_count</li>
// * <li>retweet_count</li>
// * <li>like_count</li>
// * </ul>
// *
// *
// *
// * */
router.post('/posts/comments', async (req,res) =>{
    try{
        const {postId,limit = 100,offset=0} = req.body
        const comments = await getPostComments(postId,limit,offset)
        //for each omment, append avatar
        for (let i = 0; i < comments.length; i++) {
            comments[i].avatar = fs.readFileSync(userAvatarsDir+comments[i].post_creator_avatar).toString('base64')
            comments[i].avatarPath = undefined
            let commentPhotoPathsArray = []
            let commentPhotoPathsString = comments[i].post_images
            let commentPhotos = []
            //Turn paths string into array
            console.log("commentPhotoPathsString: ",commentPhotoPathsString)
            if(commentPhotoPathsString !== null){
                commentPhotoPathsArray = commentPhotoPathsString.split(',')
            }
            //For each path, turn into base64 and push into array
            for (let j = 0; j < commentPhotoPathsArray.length; j++) {
                commentPhotos.push(fs.readFileSync(postsImagesDir+commentPhotoPathsArray[j]).toString('base64'))
            }
            comments[i].photos = commentPhotos
            console.log("commentPhotos: ",comments[i].photos)
            comments[i].post_images = undefined
        }
        
        return res.status(200).send(comments)
    }catch (e){
        
        return res.status(500).send(e)
    }

})
//post a post,
router.post('/posts/post', verifyToken, upload.array('images', 10),async (req,res) =>{
    //print we are here
    
    
    try{
        let user = req.user
        let postBody = req.body.body
        let imagesPaths=[]
        let ogPostId = JSON.parse(req.body.ogPostId) || undefined
        let isRetweet = JSON.parse(req.body.isRetweet) || false
        let isComment = JSON.parse(req.body.isComment) || false

        //print ogPostId
        
        
        
        

        if(postBody==='' && !req.files.length > 0){
            return res.status(400).send("no post body or images")
        }

        if(req.files){
            
            req.files.forEach((file) => {
                
                
                
                imagesPaths.push(file.filename)
            })
        }


        let id = await createPost(user.id, postBody, imagesPaths,ogPostId, isComment, isRetweet)
        return res.status(200).send({id})
    }catch (e){
        
        return res.status(500).send(e)
    }

})
//get post recent likers
router.post('/posts/recentLikers', async (req,res) =>{
    //return base64 images of recent likers, fetched from db
    try{
        
        
        const {postId,limit,offset} = req.body
        const likers = await getPostRecentLikers(postId,limit,offset)
        //for each liker, append avatar
        for (let i = 0; i < likers.length; i++) {
            likers[i].avatar64 = fs.readFileSync(userAvatarsDir+likers[i].avatarPath).toString('base64')
            likers[i].avatarPath = undefined
        }
        return res.status(200).send(likers)
    }
    catch (e){
        //print error and return 500
        
        return res.status(500).send(e)


    }
})

export default router