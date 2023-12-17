import express from "express";
import validator from 'validator';

import bcrypt from "bcrypt";
import {
    createUser,
    getUserById,
    getUserByEmail,
    getUserByUsername,
    updateUser,
    getUserProfile,
    getUserStats,
    getFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    deleteFriendRequest,
    checkIfFriendRequestExists,
    checkIfFriends,
    getMostPopularUsers,
    getUsersByQuery,
    getUserMiniProfile, getOwnMiniProfile
} from "../db/user-db.js";
import {getPostsByQuery} from "../db/post-db.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
const router = express.Router()

import path from 'path';
import { fileURLToPath } from 'url';



import {checkToken, verifyToken} from "../middleware/auth.js";
import * as fs from "fs";
import multer from "multer";
import {createPrivateConversation} from "../db/conversation-db.js";
import {userAvatarsDir} from "../app.js";
function fileFilter (req, file, cb) {

    
    if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg'){
        
        cb(null, false)
    }else{
        
        cb(null, true)
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'user_images/')
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


//TODO: CHANGE HTTP ONLY COOKIE NAME FROM TOKEN1 TO SOMETHING ELSE


//CHECK if authenticated
router.get('/users/authenticated', verifyToken,async (req,res) =>{
    try{
        if (req.user){
            return res.status(200).send()

        }else{
            return res.status(401).send()
        }
    }catch (e){
        
        return res.status(401).send()
    }

})

//CREATE USER / register
router.post('/users/register', async (req,res) =>{
    const {username,name,email,password} = req.body
    console.log("req.body: ", req.body)
    let user;
    console.log(1)
    
    
    if(!username || !email || !password){
        return res.status(401).send({error:"missing fields"})
    }
    if(!validator.isEmail(email)){
        return res.status(402).send({error:"invalid email"})
    }
    console.log(2)


    //check if user exists
    await getUserByEmail(email).then((_user) => {
        user = _user
    })
    console.log(3)

    if(user){
        
        return res.status(400).send({error:"user already exists"})
    }
    console.log(4)


    let encryptedPassword = await bcrypt.hash(password, 10)


    console.log(5)


    try{
        user = await createUser(username,name,email,encryptedPassword)
        console.log(6)
        const token = jwt.sign({
            id: user.id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )
        console.log(7)
        res.set("Set-Cookie", `token1=${token}; HttpOnly; Path=/; SameSite=None; Secure; max-age=1209600;`)
        console.log(8)
        return res.status(201).send(user)
    }catch (e){
        
        return res.status(500).send(e)
    }


})

//LOGIN
router.post('/users/login', async (req,res) =>{
    
    try {
        const {password, credentials} = req.body


        if (!credentials || !password) {

            return res.status(400).send({error: "missing fields"})
        }
        let user;
        if (validator.isEmail(credentials)) {
            //check if user exists from email
            user = await getUserByEmail(credentials, "id, password, avatarPath, bannerPath, username")
            if (!user) {
                return res.status(404).send({error: "email does not exist"})
            }
        } else {
            //check if user exists from username
            user = await getUserByUsername(credentials)
            if (!user) {
                return res.status(404).send({error: "username does not exist"})
            }

        }


        //check if password is correct
        const isMatch = await bcrypt.compare(password, user.password)


        if (!isMatch) {

            return res.status(400).send({error: "password is incorrect"})
        }

        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )

        // res.cookie("secureCookie", JSON.stringify(token),{
        //     secure: process.env.mode === "production",
        //     httpOnly: true,
        //     expires: dayjs().add(7, "days").toDate(),
        // })
        let now = new Date();
        let time = now.getTime();
        let expireTime = time + 1000 * 360000;
        now.setTime(expireTime);
        res.set("Set-Cookie", `token1=${token}; HttpOnly; Path=/; expires=${now.toUTCString()};`)
        return res.status(200).send(user)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send({error: e})
    }
})

//LOGOUT
router.post('/users/logout', verifyToken,async (req,res) =>{
    
    res.set("Set-Cookie", `token1=rubbish; HttpOnly; Path=/; SameSite=None; Secure; expires=${dayjs().toDate()};`)
    return res.status(200).send("logged out")

})

//get OWN avatar
router.get('/users/avatar', verifyToken, async (req,res) =>{
    try{
        let user = req.user
        if(!user){
            return res.status(404).send({error:"user not found"})
        }
        let avatarFilePath = userAvatarsDir + user.avatarPath
        if(user.avatarPath === null){
            return res.status(404).send()
        }
        if(!fs.existsSync(avatarFilePath)){
            //print
            
            return res.status(404).send({error:"avatar not found"})
        }

        let avatar = fs.readFileSync(avatarFilePath).toString('base64')
        return res.status(200).send({avatar})
    }catch (e){
        
        return res.status(500).send({error : e})
    }

    // return res.status(200).send(user.avatar)
})
router.get('/users/:id/avatar', async (req,res) =>{

    //print
    console.log("received request at /users/:id/avatar")
    let user = await getUserById(req.params.id)
    if(!user){
        
        return res.status(404).send({error:"user not found"})
    }
    let avatarFilePath = userAvatarsDir + user.avatarPath
    if(user.avatarPath === null){
        return res.status(404).send()
    }
    if(!fs.existsSync(avatarFilePath)){
        //print
        
        return res.status(404).send({error:"avatar not found"})
    }

    await fs.readFile(avatarFilePath, (err, data) =>{
        if(err){
            // 
            return res.status(500).send({error:err})
        }else{
            res.setHeader('Content-Type', 'image/png')
            return res.status(200).send(data)
        }
        // 
    })
})


//get own banner
router.get('/users/banner', verifyToken, async (req,res) =>{
    try{
        let user = req.user
        if(!user){
            return res.status(404).send({error:"user not found"})
        }
        let avatarFilePath = userAvatarsDir + user.bannerPath
        if(user.bannerPath === null){
            return res.status(404).send()
        }
        if(!fs.existsSync(avatarFilePath)){
            //print
            
            return res.status(404).send({error:"banner not found"})
        }
        let banner = fs.readFileSync(avatarFilePath).toString('base64')
        return res.status(200).send({banner})
    }catch (e){
        
        return res.status(500).send({error : e})
    }

})


//update user
router.post('/users/update', verifyToken,upload.fields([{name:'banner', maxCount:1}, {name:'avatar', maxCount: 1}]), async (req,res) =>{
    //print req
    try{
        //OLD SYSTEM NEEDED TO CHECK IF OLD PASSWORD IS CORRECT
        //NEW SYSTEM, DOESNT NOT ALLOW TO CHANGE PASSWORD HERE
        // const isMatch = await bcrypt.compare(req.body.oldPassword, req.user.password)

        // if(!isMatch){
        //
        //     return res.status(400).send({error:"password is incorrect"})
        // }

        const allowedUpdates = ["name", "status","location","email","website"]
        let updates = {}


        if(req.files['avatar']){
            if(req.files['avatar'][0]){
                //if avatar file exists, update user avatar
                updates['avatarPath'] = req.files['avatar'][0].filename
            }
        }
        if(req.files['banner']){
            if(req.files['banner'][0]){
                //if banner file exists, update user banner
                updates['bannerPath'] = req.files['banner'][0].filename
            }
        }

        //for each key in req.body, if key is not empty & update is allowed -> update user
        for (let i = 0; i < Object.keys(req.body).length; i++) {
            const key = Object.keys(req.body)[i];
            if(req.body[key] !== "" && allowedUpdates.includes(key)){
                //USED to ecrypt password
                // if(key === "password"){
                //     updates[key] = await bcrypt.hash(req.body[key], 8)
                //     continue
                // }
                updates[key] = req.body[key]
            }
        }


        await updateUser(req.user.id,updates)
    }catch(e){
        
        return res.status(500).send({error : e})
    }
    return res.status(200).send("user updated")
})


//NOTE: Get profile by username
router.get('/users/:username/:ourID', async (req,res) =>{
    try{
        let userProfile = await getUserProfile(req.params.ourID,req.params.username)
        if(!userProfile){
            return res.status(404).send({error:"user not found"})
        }
        return res.status(200).send(userProfile)

    }catch (e) {
        
        return res.status(500).send({error:e})
    }
})

router.post('/users/testToken', verifyToken,async (req,res) =>{


    return res.status(200).send("Token accepted")
})
//get username from id
router.get('/users/:id/username', async (req,res) =>{
    console.log("received request at /users/:id/username")
    let user = await getUserById(req.params.id)
    if(!user){
        return res.status(404).send({error:"user not found"})
    }
    return res.status(200).send({username:user.username})
})

//NOTE: Get most popular users:
router.get('/users/mostPopular', checkToken,async (req,res) =>{
    
    let users = await getMostPopularUsers(6,req.user?.id)
    if(!users){
        return res.status(404).send({error:"users not found"})
    }
    for (let i = 0; i < users.length; i++) {
        users[i].avatar = fs.readFileSync(userAvatarsDir + users[i].avatarPath).toString("base64")
        users[i].avatarPath = undefined

        users[i].banner = fs.readFileSync(userAvatarsDir + users[i].bannerPath).toString("base64")
        users[i].bannerPath = undefined
    }
    return res.status(200).send({users})
})


//

//NOTE: get usernames, and avatar
router.get('/:id/namesandavatar', async (req,res) =>{

    try{
        console.log("received request, contents: ", req.params.id)
        let user = await getUserById(req.params.id,"username, avatarPath, bannerPath, name")

        if(!user){

            return res.status(404).send({error:"user not found"})
        }
        //append avatar base64 to user object
        user.avatar = fs.readFileSync(userAvatarsDir + user.avatarPath).toString('base64')
        user.banner = fs.readFileSync(userAvatarsDir + user.bannerPath).toString('base64')

        return res.status(200).send({user})
    }catch (e) {

        return res.status(500).send({error: e})
    }
})

router.get('/:id/mini-profile', checkToken, async (req,res) =>{

    let user = await getUserById(req.params.id,"id")
    if(!user){
        return res.status(404).send({error:"user not found"})
    }
    //append avatar base64 to user object
    let miniProfile = await getUserMiniProfile( req.user?.id,user.id)
    
    return res.status(200).send({miniProfile})
})
router.get('/own-mini-profile', verifyToken, async (req,res) =>{
    console.log("received request")
    try{
        let miniProfile = await getOwnMiniProfile(req.user.id)
        if(!miniProfile){
            return res.status(404).send({error:"user not found"})
        }
        //append image based on path
        miniProfile.avatar = fs.readFileSync(userAvatarsDir + miniProfile.avatarPath).toString('base64')
        miniProfile.banner = fs.readFileSync(userAvatarsDir + miniProfile.bannerPath).toString('base64')
        return res.status(200).send({miniProfile})
    }catch (e) {
        return res.status(500).send({error:e})
    }
})



//get friend requests
router.get('/friendrequests',verifyToken, async (req,res) =>{
    
    let user = req.user
    if(!user){
        return res.status(404).send({error:"user not found"})
    }

    //FIXME: optimize by combining eveyrthing into one query
    let friendRequests = await getFriendRequests(user.id)

    return res.status(200).send(friendRequests)
})


//Get user stats
router.get('/:id/stats', async (req,res) =>{
    try{
        
        let stats = await getUserStats(req.params.id)
        //append stats
        
        return res.status(200).send(stats)
    }catch (e) {
        
        return res.status(500).send({error:e})
    }


})

//GET queried results
router.get('/search/:query', checkToken,async (req,res) =>{
    try{
        console.log("received request at /search/:query")
        let queriedPosts = await getPostsByQuery(req.params.query,99,0,req.user?.id)
        let queriedUsers = await getUsersByQuery(req.params.query,99,0,req.user?.id)

        // 
        

        return res.status(200).send({queriedPosts,queriedUsers})
    }
    catch (e) {
        
        return res.status(500).send({error:e})
    }

})


//FRIEND REQUESTS

//SEND FRIEND REQUEST
router.post('/friendrequests/send', verifyToken, async (req,res) =>{
    
    
    let user = req.user
    if(!user){
        return res.status(404).send({error:"user not found"})
    }
    try{

        if(user.id === req.body.receiver_user_id){
            return res.status(400).send({error:"cannot send friend request to self"})
        }
        if(req.body.receiver_user_id === undefined){
            return res.status(400).send({error:"receiver_user_id is undefined"})
        }
        //Check if friends already
        if(await checkIfFriends(user.id,req.body.receiver_user_id) === true){
            return res.status(400).send({error:"already friends"})
        }
        //check if friend request already exists
        if(await checkIfFriendRequestExists(user.id,req.body.receiver_user_id) === true){
            return res.status(400).send({error:"already sent"})
        }


        await sendFriendRequest(user.id, req.body.receiver_user_id)
        return res.status(200).send("friend request sent")
    }catch (e) {
        
        return res.status(500).send({error:e})
    }
})

//CANCEL FRIEND REQUEST
router.post('/friendrequests/cancel', verifyToken, async (req,res) =>{
    
    let user = req.user
    if(!user){
        return res.status(404).send({error:"user not found"})
    }
    try{

        //Check if friend request exists
        if(await checkIfFriendRequestExists(user.id,req.body.receiver_user_id) === false){
            return res.status(404).send({error:"friend request not found"})
        }

        await deleteFriendRequest(user.id, req.body.receiver_user_id)
        return res.status(200).send("friend request cancelled")
    }catch (e) {
        
        return res.status(500).send({error:e})
    }
})

//ACCEPT FRIEND REQUEST

router.post('/friendrequests/accept', verifyToken, async (req,res) =>{
    console.log("received request at /friendrequests/accept")
    let user = req.user
    if(!user){
        return res.status(404).send({error:"user not found"})
    }
    try{

        console.log("1 ")
        //Check if friend request exists
        if(await checkIfFriendRequestExists(req.body.sender_user_id,user.id) === false){
            return res.status(404).send({error:"friend request not found"})
        }
        //check if friend request is already accepted
        if(await checkIfFriends(req.body.sender_user_id,user.id) === true){
            return res.status(400).send({error:"friend request already accepted"})
        }
        console.log("2 ")


        await acceptFriendRequest(user.id, req.body.sender_user_id)
        //delete friend request
        await deleteFriendRequest(req.body.sender_user_id,user.id)

        //create conversation between two users
        await createPrivateConversation(user.id, req.body.sender_user_id)

        return res.status(200).send("friend request accepted")
    }catch (e) {
        
        return res.status(500).send({error:e})
    }
})

//REJECT FRIEND REQUEST
router.post('/friendrequests/reject', verifyToken, async (req,res) =>{
    
    
    let user = req.user
    if(!user){
        return res.status(404).send({error:"user not found"})
    }
    try{
        await deleteFriendRequest(req.body.sender_user_id,user.id)


        return res.status(200).send("friend request rejected")
    }catch (e) {
        
        return res.status(500).send({error:e})
    }
})




export default router