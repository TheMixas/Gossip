import {pool} from "./database.js";
import fs from "fs";
import {getUserById} from "./user-db.js";
const postsImagesDir = `C:\\Users\\themi\\WebstormProjects\\Gossip\\server\\`+`/user_posts_images/`
const userAvatarsDir = `C:\\Users\\themi\\WebstormProjects\\Gossip\\server\\`+`/user_images/`


export async function likePost(postId,userId){
    const result = await pool.query(`INSERT INTO post_likes (liked_post_id, liker_user_id)
    VALUES (?,?)`, [postId,userId])
    return result
}
export async function unlikePost(postId,userId){
    const result = await pool.query(`DELETE FROM post_likes WHERE liked_post_id = ? AND liker_user_id = ?`, [postId,userId])
    return result
}
//create post
export async function createPost(creatorId, body, imagesPaths=[],ogPostId=null,isComment=false,isRetweet=false){
    try {
        const result = await pool.query(`INSERT INTO posts (creator_user_id, body, original_post_id,isComment, isRetweet)
        VALUES (?, ?, ?, ?, ?)`, [creatorId, body, ogPostId,isComment,isRetweet])

        const postId = result[0].insertId

        for (let i = 0; i < imagesPaths.length; i++) {
            await pool.query(`INSERT INTO posts_images (post_id, image_path)
                              VALUES (?, ?)`, [postId, imagesPaths[i]])
        }

        return postId
    }catch(e){
        console.log(e)
        return null;
    }

    //return insert id


}
export async function getPostComments(postId,limit,offset){
    //if isComment true
    // and order them by number of likes and return p.body, p.created_at, user id, likes, username, name, profile picture
    const [comments] = await pool.query(`SELECT p.id, p.body, p.creator_user_id, p.created_at, COUNT(pl.liked_post_id) AS likes, u.username, u.name, u.avatarPath
    FROM posts p
    LEFT JOIN post_likes pl ON p.id = pl.liked_post_id
    LEFT JOIN users u ON p.creator_user_id = u.id
    WHERE p.isComment = true AND p.original_post_id = ?
    GROUP BY p.id
    ORDER BY likes DESC, p.created_at DESC
    LIMIT ?,?`,[postId,offset,limit])
    return comments
}
export async function getPostRecentLikers(postId,limit=99,offset=0){
    const [likers] = await pool.query(`SELECT u.id, u.username, u.name, u.avatarPath
    FROM post_likes pl
    LEFT JOIN users u ON pl.liker_user_id = u.id
    WHERE pl.liked_post_id = ?
    ORDER BY pl.created_at DESC
    LIMIT ?,?`,[postId,offset,limit])
    return likers
}
export async function getFriendsPosts(id,limit,offset) {
    // const [rows] = await pool.query('(SELECT body,creator_user_id, p1.created_at AS created_at_p1 FROM posts AS p1 JOIN friendships f ON p1.creator_user_id = f.user1_id WHERE f.user2_id = ?) UNION (SELECT body,creator_user_id, p2.created_at AS created_at_p2 FROM posts p2 JOIN friendships f ON p2.creator_user_id = f.user2_id WHERE f.user1_id = ?) ORDER BY created_at_p1, created_at_p2 DESC LIMIT ?,? ',[id, id,limit,offset]);

    const [rows] = await pool.query('SELECT body,creator_user_id,p.created_at as ca  FROM posts AS p JOIN friendships f ON (p.creator_user_id = f.user1_id OR p.creator_user_id = f.user2_id) WHERE f.user2_id = ? OR f.user1_id = ? ',[id, id]);
    return rows
}
export async function getPostsLikes(ids) {
    const [rows] = await pool.query(`SELECT liker_user_id FROM post_likes WHERE liked_post_id IN (${ids})`);
    return rows
}

export async function getPostCommentCount(postId){
    //get count of posts that have isCommented and orginal_post_id = postId
    const [count] = await pool.query(`SELECT COUNT(*) AS count FROM posts WHERE isComment = true AND original_post_id = ?`,[postId])
    return count[0].count
}
//get post retweets
export async function getPostRetweetCount(postId){
    const [count] = await pool.query(`SELECT COUNT(*) AS count FROM posts WHERE isRetweet = true AND original_post_id = ?`,[postId])
    return count[0].count

}
//get post likes
export async function getPostLikesCount(postId){
    const [count] = await pool.query(`SELECT COUNT(*) AS count FROM post_likes WHERE liked_post_id = ?`,[postId])
    return count[0].count

}
//get post stats
export async function getPostStats(postId){
    let stats = {}
    stats.comments = await getPostCommentCount(postId)
    stats.retweets = await getPostRetweetCount(postId)
    stats.likes = await getPostLikesCount(postId)
    return stats
}


//get post photos
export async function getPostPhotosPaths(postId){
    const [rows] = await pool.query(`SELECT image_path FROM posts_images WHERE post_id = ?`,[postId])
    return rows
}

//get post
export async function getPost(postId,ownId=null){
    const [rows] = await pool.query(`SELECT * FROM posts WHERE id = ?`,[postId])
    const [isLiked] = await pool.query(`SELECT * FROM post_likes WHERE liked_post_id = ? AND liker_user_id = ?`,[rows[0].id,ownId])
    rows[0].isLiked = isLiked.length > 0 || false
    return rows[0]


}

export async function getHottestPosts(limit,offset,userId=null){
    //SELECT  posts and order them by number of likes AND DATE

    const [hottestPosts] = await pool.query(`SELECT p.id, p.body, p.creator_user_id, p.created_at,original_post_id,p.isRetweet,p.isComment, COUNT(pl.liked_post_id) AS likes
    FROM posts p
    LEFT JOIN post_likes pl ON p.id = pl.liked_post_id
    WHERE p.isComment = false
    GROUP BY p.id
    ORDER BY likes DESC, p.created_at DESC
    LIMIT ?,?`,[offset,limit])
    //FOR each post add isLiked
    if(!userId) return hottestPosts
    for (let i = 0; i < hottestPosts.length; i++) {
        const [isLiked] = await pool.query(`SELECT * FROM post_likes WHERE liked_post_id = ? AND liker_user_id = ?`,[hottestPosts[i].id,userId])
        hottestPosts[i].isLiked = isLiked.length > 0
    }
    return hottestPosts

}
//NOTE: Get user posts (!comment, !retweet) with pictures
export async function getUserPosts(userId,limit=99,offset=0,withCreatorAvatars=true, withStats=false,ownId=undefined){
    //NOTE: with creator avatars appends creator avatar and banner
    const [rows] = await pool.query(`SELECT * FROM posts 
         WHERE creator_user_id = ? 
         AND isComment = false
         AND isRetweet = false
         ORDER BY created_at DESC LIMIT ?,?`,[userId,offset,limit])

    let user = await getUserById(userId,"avatarPath,bannerPath,name,username")



    for (let i = 0; i < rows.length; i++) {
        rows[i].avatar = fs.readFileSync(userAvatarsDir+user.avatarPath).toString('base64')
        // rows[i].banner = fs.readFileSync(userAvatarsDir+user.bannerPath).toString('base64')

        //Append names and isLiked
        rows[i].name = user.name
        rows[i].username = user.username
        const [isLiked] = await pool.query(`SELECT * FROM post_likes WHERE liked_post_id = ? AND liker_user_id = ?`,[rows[i].id,ownId])
        rows[i].isLiked = isLiked.length > 0 || false




    }

    if(withStats){
        for (let i = 0; i < rows.length; i++) {
            rows[i].stats = await getPostStats(rows[i].id)
        }
    }

    for (let i = 0; i < rows.length; i++) {
        let photoPaths = await getPostPhotosPaths(rows[i].id)
        let photos = []
        for(let photoPath of photoPaths){
            photos.push(fs.readFileSync(postsImagesDir+photoPath.image_path).toString('base64'))
        }
        //NOTE: Change name of photos if needed for client
        rows[i].photos = photos
    }
    return rows
}


//NOTE: Get queried posts (!comment, !retweet) with pictures
export async function getPostsByQuery(query,limit=99,offset=0,ownId=undefined){
    //NOTE: with creator avatars appends creator avatar and banner
    const [rows] = await pool.query(`SELECT * FROM posts 
         WHERE body LIKE '%${query}%'
         AND isComment = false
         ORDER BY created_at DESC LIMIT ?,?`,[offset,limit])

    let user = await getUserById(ownId,"id")

    for (let i = 0; i < rows.length; i++) {
        let creator = await getUserById(rows[i].creator_user_id,"avatarPath,name,username")
        rows[i].avatar = fs.readFileSync(userAvatarsDir+creator.avatarPath).toString('base64')
        rows[i].name = creator.name
        rows[i].username = creator.username
        const [isLiked] = await pool.query(`SELECT * FROM post_likes WHERE liked_post_id = ? AND liker_user_id = ? OR liker_user_id = ? AND liked_post_id = ?`,[rows[i].id,ownId,ownId,rows[i].id])
        rows[i].isLiked = isLiked.length > 0 || false
        rows[i].stats = await getPostStats(rows[i].id)
        rows[i].type = "post"

        }
    for (let i = 0; i < rows.length; i++) {
        let photoPaths = await getPostPhotosPaths(rows[i].id)
        let photos = []
        for(let photoPath of photoPaths){
            photos.push(fs.readFileSync(postsImagesDir+photoPath.image_path).toString('base64'))
        }
        //NOTE: Change name of photos if needed for client
        rows[i].photos = photos

    }

return rows

}


//NOTE: Get posts that contain photos with photos appended on .photos
export async function getUserPostsContainingPhotos(userId,limit=99,offset=0,ownId=undefined){
    const [rows] = await pool.query(`SELECT * FROM posts 
         WHERE creator_user_id = ? 
         AND isComment = false
         AND id IN (SELECT post_id FROM posts_images)
         ORDER BY created_at DESC LIMIT ?,?`,[userId,offset,limit])

    let user = await getUserById(userId,"avatarPath,name,username")


    for (let i = 0; i < rows.length; i++) {

        rows[i].avatar = fs.readFileSync(userAvatarsDir+user.avatarPath).toString('base64')
        rows[i].name = user.name
        rows[i].username = user.username

        let photoPaths = await getPostPhotosPaths(rows[i].id)
        let photos = []
        for(let photoPath of photoPaths){
            photos.push(fs.readFileSync(postsImagesDir+photoPath.image_path).toString('base64'))
        }
        //NOTE: Change name of photos if needed for client
        rows[i].photos = photos

        const [isLiked] = await pool.query(`SELECT * FROM post_likes WHERE liked_post_id = ? AND liker_user_id = ?`,[rows[i].id,ownId])
        rows[i].isLiked = isLiked.length > 0 || false

    }
    return rows
}

//NOTE: Get retweets that could contain photos with photos appended on .photos
export async function getUserRetweets(userId,limit=99,offset=0, withCreatorAvatars=true, withStats=false, ownId=undefined){
    const [rows] = await pool.query(`SELECT * FROM posts 
         WHERE creator_user_id = ? 
         AND isComment = false
         AND isRetweet = true
         ORDER BY created_at DESC LIMIT ?,?`,[userId,offset,limit])


    let user = await getUserById(userId,"avatarPath, bannerPath,name,username")

    for (let i = 0; i < rows.length; i++) {
        rows[i].avatar = fs.readFileSync(userAvatarsDir+user.avatarPath).toString('base64')
        rows[i].name = user.name
        rows[i].username = user.username

        const [isLiked] = await pool.query(`SELECT * FROM post_likes WHERE liked_post_id = ? AND liker_user_id = ?`,[rows[i].id,ownId])
        rows[i].isLiked = isLiked.length > 0 || false

        // rows[i].banner = fs.readFileSync(userAvatarsDir+user.bannerPath).toString('base64')
    }
    if(withStats){
        for (let i = 0; i < rows.length; i++) {
            rows[i].stats = await getPostStats(rows[i].id)
        }
    }

    for (let i = 0; i < rows.length; i++) {
        let photoPaths = await getPostPhotosPaths(rows[i].id)
        let photos = []
        for(let photoPath of photoPaths){
            photos.push(fs.readFileSync(postsImagesDir+photoPath.image_path).toString('base64'))
        }
        //NOTE: Change name of photos if needed for client
        rows[i].photos = photos
    }
    return rows
}


//NOTE: Get users pictures from their posts
export async function getUserPostsPhotos(userId,limit=99,offset=0){
    const [rows] = await pool.query(`SELECT image_path FROM posts_images WHERE post_id IN (SELECT id FROM posts WHERE creator_user_id = ?) LIMIT ?,?`,[userId,offset,limit])
    return rows
}

//NOTE: Get posts that a user has liked with photos appended on .photos
export async function getUserLikedPosts(userId,limit=99,offset=0,withStats=true,ownId=undefined){
    const [rows] = await pool.query(`SELECT * FROM posts 
         WHERE id IN (SELECT liked_post_id FROM post_likes WHERE liker_user_id = ?)
         AND isComment = false
         ORDER BY created_at DESC LIMIT ?,?`,[userId,offset,limit])


    //apend avatar and banner
    for (let i = 0; i < rows.length; i++) {
        let user = await getUserById(rows[i].creator_user_id,"avatarPath,username, name")
        rows[i].avatar = fs.readFileSync(userAvatarsDir+user.avatarPath).toString('base64')
        rows[i].name = user.name
        rows[i].username = user.username

        const [isLiked] = await pool.query(`SELECT * FROM post_likes WHERE liked_post_id = ? AND liker_user_id = ?`,[rows[i].id,ownId])
        rows[i].isLiked = isLiked.length > 0 || false
    }
    if(withStats){
        for (let i = 0; i < rows.length; i++) {
            rows[i].stats = await getPostStats(rows[i].id)
        }
    }

    for (let i = 0; i < rows.length; i++) {
        let photoPaths = await getPostPhotosPaths(rows[i].id)
        let photos = []
        for(let photoPath of photoPaths){
            photos.push(fs.readFileSync(postsImagesDir+photoPath.image_path).toString('base64'))
        }
        //NOTE: Change name of photos if needed for client
        rows[i].photos = photos
    }
    return rows
}