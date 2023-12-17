import {pool} from "./database.js";
import fs from "fs";
import {
    getUserLikedPosts,
    getUserPosts,
    getUserPostsContainingPhotos,
    getUserPostsPhotos,
    getUserRetweets
} from "./post-db.js";
import {postsImagesDir, userAvatarsDir} from "../app.js";
import {queryUserInfoAndFriendInfo} from "./big-queries/queryUserInfoAndFriendInfo.js";
import {readImagesFromPath} from "../utils/utils.js";


export async function createUser(username,name,gmail, password){
    console.log("Creating user: ", username, name, gmail, password)
    try{
        const result = await pool.query(`INSERT INTO users (username, name, gmail, password)
    VALUES (?,?,?,?)`, [username,name,gmail,password])
        return getUserById(result[0].insertId, "id,username,name,gmail,created")
    }
    catch (e){
        console.log("sql e:", e)
    }

}
export async function getUserById(id,selection="*"){
    try{
        const [rows] = await pool.query(`SELECT ${selection} FROM users WHERE id = ?`, [id])
        return rows[0];
    }catch (e){
        console.log(e)
    }

}
export async function getUserByUsername(username,selection="*"){
    const [rows] = await pool.query(`SELECT ${selection} FROM users WHERE username = ?`, [username])
    return rows[0];
}
export async function getUserByEmail(email, selection="*"){
    try{
        const [rows] = await pool.query(`SELECT ${selection} FROM users WHERE gmail = ?`, [email])
        return rows[0];
    }
    catch (e){
        console.log(e)
    }

}

//NOTE: Get users mutual friends
export async function getMutuals(ourId, userId){
    const [rows] = await pool.query(`SELECT user1_id as mutual FROM friendships WHERE user2_id = ? AND user1_id IN (SELECT user1_id FROM friendships WHERE user2_id = ?) UNION SELECT user2_id as mutual FROM friendships WHERE user1_id = ? AND user2_id IN (SELECT user2_id FROM friendships WHERE user1_id = ?)`,[ourId,userId,ourId,userId])
    return rows
}

//NOTE: Get user profile info
export async function getUserProfile(our_id,profileUsername){
    //TODO: OPTIMIZE INTO ONE QUERY
    try {

        // let user = await getUserByUsername(profileUsername, "id,username, name, location, website, status, avatarPath, bannerPath,created")

        //STEP 1: Get user infO and get isFriend and isFriendRequestSent
        let user = await queryUserInfoAndFriendInfo(profileUsername, our_id)
        if(!user) {
            console.log("User not found while querying user profile info + friend info")
            return null
        }
        console.log("User profile info: ", user)
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
            postImages.push(fs.readFileSync(postsImagesDir + path.image_path).toString("base64"))
        }
        user.postImages = postImages
        //STEP 5: Append user posts
        //Query optimized
        user.posts = await getUserPosts(user.id, our_id,99,0)
        // for(let post of user.posts){
        //     console.log("Post: ", post)
        //     console.log("Post avatar: ", post.avatar)
        //     // if(post.original_post_id !== null){
        //     //     console.log("Post is retweet")
        //     //     console.log("Post.original_avatar: ", post.original_avatar)
        //     // }
        // }
        //STEP 6: Append user retweetts
        user.retweets = await getUserRetweets(user.id,our_id,99,0)
        //STEP 7: Append user liked posts
        user.likedPosts = await getUserLikedPosts(user.id,our_id,99,0)
        //STEP 8: Append user posts with photos
        user.photoPosts = await getUserPostsContainingPhotos(user.id,our_id,99,0)
        //STEP 9: Append user friends
        user.friends = await getFriends(user.id, our_id)
        //turn isFriend and isFriendRequestSent into boolean
        user.IsFriend = user.isFriend > 0
        user.IsFriendRequestSent = user.isFriendRequestSent > 0

        return user
    }catch (e) {
        console.log("Encountered error while getting user profile info: ", e)
        return e
    }

}

export async function getUserMiniProfile(our_id,profileId){
    try {
        //STEP 1: Get user infO
        let user = await pool.query(`
        SELECT 
    u.id, u.username, u.name, u.location, u.website, u.status, u.avatarPath, u.bannerPath, u.created,
    CASE 
        WHEN EXISTS (
            SELECT 1
            FROM friendships f
            WHERE (f.user1_id = u.id AND f.user2_id = ?) OR (f.user1_id = ? AND f.user2_id = u.id)
        ) THEN 1
        ELSE 0
    END AS is_friend,
    CASE 
        WHEN EXISTS (
            SELECT 1
            FROM friend_requests fr
            WHERE (fr.sender_user_id = ? AND fr.recipient_user_id = u.id) OR (fr.sender_user_id = u.id AND fr.recipient_user_id = ?)
        ) THEN 1
        ELSE 0
    END AS is_friend_request_sent
FROM users u
WHERE u.id =?;
`,[our_id,our_id,our_id,our_id,profileId])[0]
        user.avatar = readImagesFromPath(user.avatarPath, true)
        user.banner = readImagesFromPath(user.bannerPath, true)
        return user
    }catch (e) {
        
    }

}

/*
* Params:<br>
*  id: user id
* Returns:
* <ul>
* <li>username</li>
* <li>name</li>
* <li>avatarPath</li>
* <li>bannerPath</li>
* <li>created</li>
* <li>status</li>
* <li>postCount</li>
* <li>friendCount</li>
* <li>likesCount</li>
* </ul>
*
* */
export async function getOwnMiniProfile(id){
    try {
        const [rows] = await pool.query(`SELECT 
    u.username, u.name, u.avatarPath, u.bannerPath, u.created, u.status,
    (SELECT COUNT(*) FROM posts WHERE creator_user_id = u.id) as postCount,
    (SELECT COUNT(*) FROM friendships WHERE user1_id = u.id OR user2_id = u.id) as friendCount,
    (SELECT COUNT(*) FROM post_likes WHERE liked_post_id IN (SELECT id FROM posts WHERE creator_user_id = u.id)) as likesCount
FROM 
    users u
WHERE 
    u.id = ?`, [id])
        return rows[0]
    }catch (e) {
     console.log("mysql error while getting own mini profile:  ", e)
    }
}


/*
* Returns users with the most liked posts
* Returns a list of users:
* <h1>User:</h1>
* <ul>
* <li>username</li>
* <li>name</li>
* <li>avatarPath</li>
* <li>bannerPath</li>
* <li>status</li>
* <li>likesCount</li>
* </ul>
*
* */
export async function getMostPopularUsers(limit=10, ownID){
    try{
        const [rows] = await pool.query(`
        SELECT
                users.name,
                users.username,
                users.bannerPath,
                users.status,
                users.avatarPath,
                COUNT(post_likes.liked_post_id) AS likeCount
        FROM users
        LEFT JOIN posts ON users.id = posts.creator_user_id
        LEFT JOIN post_likes ON posts.id = post_likes.liked_post_id
        GROUP BY users.id
        ORDER BY likeCount DESC
        LIMIT ?;`, [limit])
        return rows
    }catch (e) {
        
    }
}




//UPDATE
export async function getFriendIds(id) {
    const [rows] = await pool.query('SELECT user1_id as friend FROM users u JOIN friendships f ON f.user1_id = u.id WHERE f.user2_id = ? UNION SELECT user2_id as friend FROM users u JOIN friendships f ON f.user2_id = u.id WHERE f.user1_id = ?',[id, id]);
    return rows
}
//Returns friends with all their info
export async function getFriends(id, our_id){
    const [rows] = await pool.query(`
   SELECT 
    u.id, u.username, u.name, u.location, u.website, u.status, u.avatarPath, u.bannerPath, u.created,
     CASE 
        WHEN EXISTS (
            SELECT 1
            FROM friendships f
            WHERE (f.user1_id = u.id AND f.user2_id = ?) OR (f.user1_id = ? AND f.user2_id = u.id)
        ) THEN 1
        ELSE 0
    END AS is_friend,
    CASE 
        WHEN EXISTS (
            SELECT 1
            FROM friend_requests fr
            WHERE (fr.sender_user_id = ? AND fr.recipient_user_id = u.id) OR (fr.sender_user_id = u.id AND fr.recipient_user_id = ?)
        ) THEN 1
        ELSE 0
    END AS is_friend_request_sent
FROM 
    users u
JOIN 
    friendships f ON (u.id = f.user1_id AND f.user2_id = ?) OR (u.id = f.user2_id AND f.user1_id = ?)
WHERE 
    u.id <>?; -- Exclude the user itself from the results

    `,[our_id,our_id,our_id,our_id,id,id,id])
    for (let i = 0; i < rows.length; i++) {
        rows[i].avatar = readImagesFromPath(rows[i].avatarPath, true)
        rows[i].banner = readImagesFromPath(rows[i].bannerPath, true)

        rows[i].avatarPath = undefined
        rows[i].bannerPath = undefined
    }
    return rows
}
export async function updateUser(id, updateValues){
    try{
        for (let i = 0; i < Object.keys(updateValues).length; i++) {
            //if not null or empty
            if(Object.values(updateValues)[i] === null || Object.values(updateValues)[i] === "") return

            await pool.query(`UPDATE users SET ${Object.keys(updateValues)[i]} = ? WHERE id = ?`, [Object.values(updateValues)[i], id])
        }

        return "Success";
    }
    catch (e) {
        console.log("SQL error on user update: ", e)
    }

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
//Returns friend requests with all their info and images
export async function getFriendRequests(id) {
    const [rows] = await pool.query(`
    SELECT fr.sender_user_id, u.avatarPath,u.bannerPath, u.name, u.username
FROM friend_requests fr
INNER JOIN users u ON fr.sender_user_id = u.id
WHERE fr.recipient_user_id = ?;
    `,[id]);
    //
    for (let i = 0; i < rows.length; i++) {
        rows[i].avatar = readImagesFromPath(rows[i].avatarPath, true)
        rows[i].banner = readImagesFromPath(rows[i].bannerPath, true)

        rows[i].avatarPath = undefined
        rows[i].bannerPath = undefined
    }
    return rows
}
export async function acceptFriendRequest(senderId,recipientId){
    console.log("Accepting friend request: ", senderId, recipientId)
    const result = await pool.query(`INSERT INTO friendships (user1_id, user2_id)
    VALUES (?,?)`, [senderId,recipientId])
    return result
}

//NOTE: Reject friend request
export async function deleteFriendRequest(senderId, recipientId){
    console.log("Deleting friend request: ", senderId, recipientId)
    try{
        const result = await pool.query(`DELETE FROM friend_requests WHERE sender_user_id = ? AND recipient_user_id = ?`,
            [senderId,recipientId])
        return result
    }catch (e) {
        console.log("SQL error on friend request delete: ", e)
    }
}
//NOTE: check if user is friends with another user. false / true
//FIXED ?
export async function checkIfFriends(user1Id, user2Id){
    const [rows] = await pool.query(`SELECT id FROM friendships WHERE user1_id = ? AND user2_id = ? OR user1_id = ? AND user2_id = ?`, [user1Id,user2Id, user2Id, user1Id])
    return rows.length > 0
}



//NOTE: friend request exists. true / false
//FIXED ?
export async function checkIfFriendRequestExists(senderId, recipientId){
    const [rows] = await pool.query(`SELECT id FROM friend_requests WHERE sender_user_id = ? AND recipient_user_id = ?`, [senderId,recipientId])
    return rows.length > 0
}

export async function deleteFriendship(user1Id, user2Id){
    const result = await pool.query(`DELETE FROM friendships WHERE user1_id = ? AND user2_id = ?`, [user1Id,user2Id])
    return result
}