import {pool} from "./database.js";
import fs from "fs";
import {
    getUserLikedPosts,
    getUserPosts,
    getUserPostsContainingPhotos,
    getUserPostsPhotos,
    getUserRetweets
} from "./post-db.js";
const userAvatarsDir = `C:\\Users\\themi\\WebstormProjects\\Gossip\\server\\`+`/user_images/`
const postsImagesDir = `C:\\Users\\themi\\WebstormProjects\\Gossip\\server\\`+`/user_posts_images/`

export async function createUser(username,status,gmail, password){
    const result = await pool.query(`INSERT INTO users (username, status, gmail, password)
    VALUES (?,?,?,?)`, [username,status,gmail,password])
    return getUserById(result[0].insertId)
}
export async function getUserById(id,selection="*"){
    const [rows] = await pool.query(`SELECT ${selection} FROM users WHERE id = ?`, [id])
    return rows[0];
}
export async function getUserByUsername(username,selection="*"){
    const [rows] = await pool.query(`SELECT ${selection} FROM users WHERE username = ?`, [username])
    return rows[0];
}
export async function getUserByEmail(email){
    const [rows] = await pool.query(`SELECT * FROM users WHERE gmail = ?`, [email])
    return rows[0];
}

//NOTE: Get users mutual friends
export async function getMutuals(ourId, userId){
    const [rows] = await pool.query(`SELECT user1_id as mutual FROM friendships WHERE user2_id = ? AND user1_id IN (SELECT user1_id FROM friendships WHERE user2_id = ?) UNION SELECT user2_id as mutual FROM friendships WHERE user1_id = ? AND user2_id IN (SELECT user2_id FROM friendships WHERE user1_id = ?)`,[ourId,userId,ourId,userId])
    return rows
}

//NOTE: Get user profile info
export async function getUserProfile(our_id,profileUsername){
    try {
        //STEP 1: Get user infO
        let user = await getUserByUsername(profileUsername, "id,username, name, location, website, status, avatarPath, bannerPath,created")
        if(!user) return null
        //STEP 2: Append base64 image data
        user.avatar = fs.readFileSync(userAvatarsDir + user.avatarPath).toString("base64")
        user.banner = fs.readFileSync(userAvatarsDir + user.bannerPath).toString("base64")
        user.avatarPath = undefined
        user.bannerPath = undefined

        //STEP 3: Append mutual friend`s ids
        user.mutuals = await getMutuals(our_id, user.id)
        //STEP 4: Append user`s post photos //NOTE: REDO THIS
        let postImagePaths = await getUserPostsPhotos(user.id)
        let postImages = []
        for (let path of postImagePaths) {
            console.log("path.imagePath: ", path.image_path)
            console.log("path: ", path)
            postImages.push(fs.readFileSync(postsImagesDir + path.image_path).toString("base64"))
        }
        user.postImages = postImages
        //STEP 5: Append user posts
        user.posts = await getUserPosts(user.id, 99, 0, true,true,our_id)
        //STEP 6: Append user retweetts
        user.retweets = await getUserRetweets(user.id,99,0,true,true,our_id)
        //STEP 7: Append user liked posts
        user.likedPosts = await getUserLikedPosts(user.id,99,0,true,our_id)
        //STEP 8: Append user posts with photos
        user.photoPosts = await getUserPostsContainingPhotos(user.id,99,0,our_id)
        //STEP 9: Append user friends
        user.friends = await getFriendIds(user.id)
        //Step 10: Append isFriend
        user.isFriend = await checkIfFriends(user.id,our_id)
        //Step 11: Append isFriendRequestSent
        user.isFriendRequestSent = await checkIfFriendRequestExists(our_id,user.id)

        return user
    }catch (e) {
        console.log(e)
    }

}

export async function getUserMiniProfile(our_id,profileId){
    try {
        //STEP 1: Get user infO
        let user = await getUserById(profileId, "id,username, name, avatarPath,bannerPath,created,status")
        if(!user) return null
        //STEP 2: Append base64 image data
        user.avatar = fs.readFileSync(userAvatarsDir + user.avatarPath).toString("base64")
        user.banner = fs.readFileSync(userAvatarsDir + user.bannerPath).toString("base64")
        user.avatarPath = undefined
        user.bannerPath = undefined
        //STEP 3: Append mutual friend`s ids
        // user.mutuals = await getMutuals(our_id, user.id)
        // //STEP 4: Append user friends
        // user.friends = await getFriendIds(user.id)
        //Step 5: Append isFriend
        user.isFriend = await checkIfFriends(user.id,our_id)
        //Step 6: Append isFriendRequestSent
        user.isFriendRequestSent = await checkIfFriendRequestExists(our_id,user.id)

        console.log("user: ", user)
        return user
    }catch (e) {
        console.log("Encountered error while getting mini profile", e)
    }

}


//NOTE: Get users with most friends
export async function getMostPopularUsers(limit=10, ownID){
    try{
        const [rows] = await pool.query(`SELECT id, username, name, avatarPath, (SELECT COUNT(*) FROM friendships WHERE user1_id = u.id OR user2_id = u.id) as friendCount FROM users u ORDER BY friendCount DESC LIMIT ?`, [limit])

        //append image
        //append isFriend
        //append isFriendRequestSent

        for (let i = 0; i < rows.length; i++) {
            rows[i].avatar = fs.readFileSync(userAvatarsDir + rows[i].avatarPath).toString("base64")
            rows[i].avatarPath = undefined
            rows[i].isFriend = await checkIfFriends(rows[i].id, ownID)
            rows[i].isFriendRequestSent = await checkIfFriendRequestExists(ownID,rows[i].id)


            //Remove YOURSELF from the list
            if(rows[i].id === ownID) {
                rows.splice(i,1)
                i--
            }

        }
        return rows
    }catch (e) {
        console.log(e)
    }
}




//UPDATE
export async function getFriendIds(id) {
    const [rows] = await pool.query('SELECT user1_id as friend FROM users u JOIN friendships f ON f.user1_id = u.id WHERE f.user2_id = ? UNION SELECT user2_id as friend FROM users u JOIN friendships f ON f.user2_id = u.id WHERE f.user1_id = ?',[id, id]);
    return rows
}
export async function updateUser(id, updateValues){
    for (let i = 0; i < Object.keys(updateValues).length; i++) {
        //if not null or empty
        if(Object.values(updateValues)[i] === null || Object.values(updateValues)[i] === "") return

        await pool.query(`UPDATE users SET ${Object.keys(updateValues)[i]} = ? WHERE id = ?`, [Object.values(updateValues)[i], id])
    }

    return "Success";
}

export async function deleteAccount(id){
    const result = await pool.query(`DELETE FROM users WHERE id = ?`, [id])
    return result

}
//NOTE: Get users friends
//NOTE2:

//Note: Get users based on query
export async function getUsersByQuery(query, limit=99, offset, ownID){
    const result = await pool.query(`SELECT id, username, name, avatarPath,bannerPath, status FROM users WHERE username LIKE '%${query}%' OR name LIKE '%${query}%' LIMIT ? OFFSET ?`, [limit, offset])
    let users = result[0]
    for (let i = 0; i < users.length; i++) {
        users[i].avatar = fs.readFileSync(userAvatarsDir + users[i].avatarPath).toString("base64")
        users[i].banner = fs.readFileSync(userAvatarsDir + users[i].bannerPath).toString("base64")
        users[i].avatarPath = undefined
        users[i].bannerPath = undefined
        users[i].isFriend = await checkIfFriends(users[i].id, ownID)
        users[i].isFriendRequestSent = await checkIfFriendRequestExists(ownID,users[i].id)
        users[i].type = "user"

        //Remove YOURSELF from the list
        if(users[i].id === ownID) {
            users.splice(i,1)
            i--
        }

    }


    return users
}


//NOTE: Get user post count, friend count and likes received count
export async function getUserStats(id){
const [rows] = await pool.query(`SELECT (SELECT COUNT(*) FROM posts WHERE creator_user_id = ?) as postCount, (SELECT COUNT(*) FROM friendships WHERE user1_id = ? OR user2_id = ?) as friendCount, (SELECT COUNT(*) FROM post_likes WHERE liked_post_id IN (SELECT id FROM posts WHERE creator_user_id = ?)) as likesCount`,[id,id,id,id])
    return rows[0]
}

//SECTION: FRIEND REQUESTS
export async function sendFriendRequest(senderId,recipientId){
    const result = await pool.query(`INSERT INTO friend_requests (sender_user_id, recipient_user_id)
    VALUES (?,?)`, [senderId,recipientId])
    return result
}
export async function getFriendRequests(id) {
    const [rows] = await pool.query('SELECT sender_user_id FROM friend_requests f WHERE recipient_user_id = ?',[id]);
    // console.log("rows: ", rows)

    return rows
}
export async function acceptFriendRequest(senderId,recipientId){
    const result = await pool.query(`INSERT INTO friendships (user1_id, user2_id)
    VALUES (?,?)`, [senderId,recipientId])
    return result
}

//NOTE: Reject friend request
export async function deleteFriendRequest(senderId, recipientId){
    const result = await pool.query(`DELETE FROM friend_requests WHERE sender_user_id = ? AND recipient_user_id = ?`, [senderId,recipientId])
    return result
}
//NOTE: check if user is friends with another user. false / true
export async function checkIfFriends(user1Id, user2Id){
    const [rows] = await pool.query(`SELECT * FROM friendships WHERE user1_id = ? AND user2_id = ? OR user1_id = ? AND user2_id = ?`, [user1Id,user2Id, user2Id, user1Id])
    return rows.length > 0
}



//NOTE: friend request exists. true / false
export async function checkIfFriendRequestExists(senderId, recipientId){
    const [rows] = await pool.query(`SELECT * FROM friend_requests WHERE sender_user_id = ? AND recipient_user_id = ?`, [senderId,recipientId])
    return rows.length > 0
}

export async function deleteFriendship(user1Id, user2Id){
    const result = await pool.query(`DELETE FROM friendships WHERE user1_id = ? AND user2_id = ?`, [user1Id,user2Id])
    return result
}