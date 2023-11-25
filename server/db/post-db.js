import {pool} from "./database.js";
import fs from "fs";
import {getUserById} from "./user-db.js";
import {postsImagesDir, userAvatarsDir} from "../app.js";
import {readAllPostsImages} from "../utils/utils.js";

//FIXME: STOP QUERYING MORE THAN ONCE IN A FUNCTION

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
        
        return null;
    }

    //return insert id


}
/*
Returns post comments with avatar paths
* Params:
* <ul>
* <li>postId</li>
* <li>limit</li>
* <li>offset</li>
* </ul>
* Returns:
* <ul>
* <li>post_id</li>
* <li>body</li>
* <li>post_creator_id</li>
* <li>created_at</li>
* <li>post_likes</li>
* <li>post_creator_username</li>
* <li>post_creator_name</li>
* <li>post_creator_avatar</li>
* <li>post_image</li>
* <li>comment_count</li>
* <li>retweet_count</li>
* <li>like_count</li>
* </ul>
*
*
*
* */
export async function getPostComments(postId,limit,offset){
    //if isComment true
    // and order them by number of likes and return p.body, p.created_at, user id, likes, username, name, profile picture
    const [comments] = await pool.query(
        `SELECT 
    p.id AS post_id, 
    p.body AS body, 
    p.creator_user_id AS post_creator_id, 
    p.created_at AS created_at, 
    COUNT(pl.liked_post_id) AS post_likes, 
    u.username AS creator_username, 
    u.name AS creator_name, 
    u.avatarPath AS post_creator_avatar,
    pi.image_path AS post_images,
    comment_count.count AS comment_count,
    retweet_count.count AS retweet_count,
    like_count.count AS like_count
FROM 
    posts p
LEFT JOIN 
    post_likes pl ON p.id = pl.liked_post_id
LEFT JOIN 
    users u ON p.creator_user_id = u.id
LEFT JOIN 
    posts_images pi ON p.id = pi.post_id
LEFT JOIN (
    SELECT 
        original_post_id, 
        COUNT(*) AS count 
    FROM 
        posts 
    WHERE 
        isComment = true 
    GROUP BY 
        original_post_id
) comment_count ON p.id = comment_count.original_post_id
LEFT JOIN (
    SELECT 
        original_post_id, 
        COUNT(*) AS count 
    FROM 
        posts 
    WHERE 
        isRetweet = true 
    GROUP BY 
        original_post_id
) retweet_count ON p.id = retweet_count.original_post_id
LEFT JOIN (
    SELECT 
        liked_post_id, 
        COUNT(*) AS count 
    FROM 
        post_likes post_likes
    GROUP BY 
        liked_post_id
) like_count ON p.id = like_count.liked_post_id
WHERE 
    p.isComment = true 
    AND p.original_post_id = ? 
GROUP BY 
    p.id, pi.image_path, comment_count.count, retweet_count.count, like_count.count
ORDER BY 
    post_likes DESC, created_at DESC
LIMIT ?,?;
`,[postId,offset,limit])
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


/*
*   Params:
*       <ul>
*           <li>userId</li>
*          <li>ownId</li>
*          <li>limit</li>
*         <li>offset</li>
*      </ul>
* Rretuns the base64 encoded avatar of the user
* and post photos
*  Returns list of posts of a user:<br>
* Posat object:
*     <ul>
* <li>id</li>
* <li>body</li>
* <li>creator_user_id</li>
* <li>created_at</li>
* <li>isComment</li>
* <li>isRetweet</li>
* <li>original_post_id</li>
* <li>user_liked</li>
* <li>creator_avatarPath</li>
* <li>creator_name</li>
* <li>creator_username</li>
* <li>creator_bannerPath</li>
* <li>comment_count</li>
* <li>retweet_count</li>
* <li>like_count</li>
* <li>post_image_paths</li>
* and more
*
*
* </ul>
*
*/
export async function getUserPosts(userID,ownID,limit=99,offset=0,) {
    try {
        const [rows] = await pool.query(`SELECT 
    p.id, 
    p.body, 
    p.creator_user_id, 
    p.created_at,
    p.original_post_id,
    p.isRetweet,
    p.isComment,
    COALESCE(pc.comment_count, 0) AS comment_count,
    COALESCE(pr.retweet_count, 0) AS retweet_count,
    COALESCE(pl.like_count, 0) AS like_count,
    CASE WHEN plu.liker_user_id IS NOT NULL THEN 1 ELSE 0 END AS user_liked,
    GROUP_CONCAT(pi.image_path) AS post_image_paths,
    op.body AS original_body,
    op.creator_user_id AS original_creator_user_id,
    op.created_at AS original_created_at,
    COALESCE(opc.comment_count, 0) AS original_comment_count,
    COALESCE(opr.retweet_count, 0) AS original_retweet_count,
    COALESCE(opl.like_count, 0) AS original_like_count,
    CASE WHEN oplu.liker_user_id IS NOT NULL THEN 1 ELSE 0 END AS original_user_liked,
    GROUP_CONCAT(opi.image_path) AS original_image_paths,
    u.username AS creator_username,
    u.name AS creator_name,
    u.bannerPath AS creator_bannerPath,
    u.avatarPath AS creator_avatarPath,
    ou.avatarPath AS original_creator_avatarPath,
    ou.username AS original_creator_username,  -- Added field for original creator username
    ou.name AS original_creator_name  -- Added field for original creator name
FROM posts p
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS comment_count
    FROM posts
    WHERE isComment = true
    GROUP BY original_post_id
) pc ON p.id = pc.original_post_id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS retweet_count
    FROM posts
    WHERE isRetweet = true
    GROUP BY original_post_id
) pr ON p.id = pr.original_post_id
LEFT JOIN (
    SELECT liked_post_id, COUNT(*) AS like_count
    FROM post_likes
    GROUP BY liked_post_id
) pl ON p.id = pl.liked_post_id
LEFT JOIN (
    SELECT liked_post_id, liker_user_id
    FROM post_likes
    WHERE liker_user_id IS NULL
) plu ON p.id = plu.liked_post_id
LEFT JOIN posts_images pi ON p.id = pi.post_id
LEFT JOIN posts op ON p.original_post_id = op.id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS comment_count
    FROM posts
    WHERE isComment = true
    GROUP BY original_post_id
) opc ON op.id = opc.original_post_id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS retweet_count
    FROM posts
    WHERE isRetweet = true
    GROUP BY original_post_id
) opr ON op.id = opr.original_post_id
LEFT JOIN (
    SELECT liked_post_id, COUNT(*) AS like_count
    FROM post_likes
    GROUP BY liked_post_id
) opl ON op.id = opl.liked_post_id
LEFT JOIN (
    SELECT liked_post_id, liker_user_id
    FROM post_likes
    WHERE liker_user_id = ?
) oplu ON op.id = oplu.liked_post_id
LEFT JOIN posts_images opi ON op.id = opi.post_id
JOIN users u ON p.creator_user_id = u.id
LEFT JOIN users ou ON op.creator_user_id = ou.id  -- Added join for original creator
WHERE (p.isComment = false OR p.isRetweet = true) AND p.creator_user_id = ?
GROUP BY p.id
ORDER BY (pc.comment_count + pr.retweet_count + pl.like_count) DESC, p.created_at DESC
LIMIT ?, ?

    `, [ownID, userID, offset, limit])

        // for (let i = 0; i < rows.length; i++) {
        //     //Append avatar photos
        //     rows[i].avatar = readImagesFromPath(rows[i].creator_avatarPath, true)
        //     rows[i].creator_avatarPath = undefined
        //
        //     //Append post photos
        //     rows[i].photos = readImagesFromPath(rows[i].post_image_paths, false)
        //     rows[i].post_image_paths = undefined
        //
        //     if (rows[i].original_post_id) {
        //         console.log("Original post avatarpath ", rows[i].original_creator_avatarPath)
        //         //Append original post avatar photos
        //         rows[i].original_avatar = readImagesFromPath(rows[i].original_creator_avatarPath, true)
        //         console.log("Original avatar: ", rows[i].original_avatar)
        //         rows[i].original_avatarPath = undefined
        //
        //         //Append original post photos
        //         rows[i].original_photos = readImagesFromPath(rows[i].original_image_paths, false)
        //         rows[i].original_image_paths = undefined
        //     }
        //
        // }

        // console.log("Queried specific users posts: ", rows)
        return readAllPostsImages(rows)
    } catch (e) {
        console.log("Encountered error while quering specific users posts: ", e)
        return null
    }

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
export async function getUserPostsContainingPhotos(userId,ownId,limit=99,offset=0){
    const [rows] = await pool.query(`
  
SELECT 
    p.id, 
    p.body, 
    p.creator_user_id, 
    p.created_at,
    p.original_post_id,
    p.isRetweet,
    p.isComment,
    COALESCE(pc.comment_count, 0) AS comment_count,
    COALESCE(pr.retweet_count, 0) AS retweet_count,
    COALESCE(pl.like_count, 0) AS like_count,
    CASE WHEN plu.liker_user_id IS NOT NULL THEN 1 ELSE 0 END AS user_liked,
    GROUP_CONCAT(pi.image_path) AS post_image_paths,
    op.body AS original_body,
    op.creator_user_id AS original_creator_user_id,
    op.created_at AS original_created_at,
    COALESCE(opc.comment_count, 0) AS original_comment_count,
    COALESCE(opr.retweet_count, 0) AS original_retweet_count,
    COALESCE(opl.like_count, 0) AS original_like_count,
    CASE WHEN oplu.liker_user_id IS NOT NULL THEN 1 ELSE 0 END AS original_user_liked,
    GROUP_CONCAT(opi.image_path) AS original_image_paths,
    u.username AS creator_username,
    u.name AS creator_name,
    u.bannerPath AS creator_bannerPath,
    u.avatarPath AS creator_avatarPath,
    ou.avatarPath AS original_creator_avatarPath,
    ou.username AS original_creator_username,  
    ou.name AS original_creator_name  
FROM posts p
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS comment_count
    FROM posts
    WHERE isComment = true
    GROUP BY original_post_id
) pc ON p.id = pc.original_post_id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS retweet_count
    FROM posts
    WHERE isRetweet = true
    GROUP BY original_post_id
) pr ON p.id = pr.original_post_id
LEFT JOIN (
    SELECT liked_post_id, COUNT(*) AS like_count
    FROM post_likes
    GROUP BY liked_post_id
) pl ON p.id = pl.liked_post_id
LEFT JOIN (
    SELECT liked_post_id, liker_user_id
    FROM post_likes
    WHERE liker_user_id IS NULL
) plu ON p.id = plu.liked_post_id
LEFT JOIN posts_images pi ON p.id = pi.post_id
LEFT JOIN posts op ON p.original_post_id = op.id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS comment_count
    FROM posts
    WHERE isComment = true
    GROUP BY original_post_id
) opc ON op.id = opc.original_post_id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS retweet_count
    FROM posts
    WHERE isRetweet = true
    GROUP BY original_post_id
) opr ON op.id = opr.original_post_id
LEFT JOIN (
    SELECT liked_post_id, COUNT(*) AS like_count
    FROM post_likes
    GROUP BY liked_post_id
) opl ON op.id = opl.liked_post_id
LEFT JOIN (
    SELECT liked_post_id, liker_user_id
    FROM post_likes
    WHERE liker_user_id = ?
) oplu ON op.id = oplu.liked_post_id
LEFT JOIN posts_images opi ON op.id = opi.post_id
JOIN users u ON p.creator_user_id = u.id
LEFT JOIN users ou ON op.creator_user_id = ou.id  
WHERE (p.isComment = false OR p.isRetweet = true) AND p.creator_user_id = ? AND pi.image_path IS NOT NULL
GROUP BY p.id
ORDER BY (pc.comment_count + pr.retweet_count + pl.like_count) DESC, p.created_at DESC
LIMIT ?, ?



    `,[ownId,userId,offset,limit])

    return readAllPostsImages(rows)
}

//NOTE: Get retweets that could contain photos with photos appended on .photos
export async function getUserRetweets(userId,ownId,limit=99,offset=0){
    const [rows] = await pool.query(`
    SELECT 
    p.id, 
    p.body, 
    p.creator_user_id, 
    p.created_at,
    p.original_post_id,
    p.isRetweet,
    p.isComment,
    COALESCE(pc.comment_count, 0) AS comment_count,
    COALESCE(pr.retweet_count, 0) AS retweet_count,
    COALESCE(pl.like_count, 0) AS like_count,
    CASE WHEN plu.liker_user_id IS NOT NULL THEN 1 ELSE 0 END AS user_liked,
    GROUP_CONCAT(pi.image_path) AS post_image_paths,
    op.body AS original_body,
    op.creator_user_id AS original_creator_user_id,
    op.created_at AS original_created_at,
    COALESCE(opc.comment_count, 0) AS original_comment_count,
    COALESCE(opr.retweet_count, 0) AS original_retweet_count,
    COALESCE(opl.like_count, 0) AS original_like_count,
    CASE WHEN oplu.liker_user_id IS NOT NULL THEN 1 ELSE 0 END AS original_user_liked,
    GROUP_CONCAT(opi.image_path) AS original_image_paths,
    u.username AS creator_username,
    u.name AS creator_name,
    u.bannerPath AS creator_bannerPath,
    u.avatarPath AS creator_avatarPath,
    ou.avatarPath AS original_creator_avatarPath,
    ou.username AS original_creator_username,
    ou.name AS original_creator_name
FROM posts p
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS comment_count
    FROM posts
    WHERE isComment = true
    GROUP BY original_post_id
) pc ON p.id = pc.original_post_id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS retweet_count
    FROM posts
    WHERE isRetweet = true
    GROUP BY original_post_id
) pr ON p.id = pr.original_post_id
LEFT JOIN (
    SELECT liked_post_id, COUNT(*) AS like_count
    FROM post_likes
    GROUP BY liked_post_id
) pl ON p.id = pl.liked_post_id
LEFT JOIN (
    SELECT liked_post_id, liker_user_id
    FROM post_likes
    WHERE liker_user_id IS NULL
) plu ON p.id = plu.liked_post_id
LEFT JOIN posts_images pi ON p.id = pi.post_id
LEFT JOIN posts op ON p.original_post_id = op.id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS comment_count
    FROM posts
    WHERE isComment = true
    GROUP BY original_post_id
) opc ON op.id = opc.original_post_id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS retweet_count
    FROM posts
    WHERE isRetweet = true
    GROUP BY original_post_id
) opr ON op.id = opr.original_post_id
LEFT JOIN (
    SELECT liked_post_id, COUNT(*) AS like_count
    FROM post_likes
    GROUP BY liked_post_id
) opl ON op.id = opl.liked_post_id
LEFT JOIN (
    SELECT liked_post_id, liker_user_id
    FROM post_likes
    WHERE liker_user_id = ?
) oplu ON op.id = oplu.liked_post_id
LEFT JOIN posts_images opi ON op.id = opi.post_id
JOIN users u ON p.creator_user_id = u.id
LEFT JOIN users ou ON op.creator_user_id = ou.id
WHERE p.isRetweet = true AND p.creator_user_id = ?
GROUP BY p.id
ORDER BY (pc.comment_count + pr.retweet_count + pl.like_count) DESC, p.created_at DESC
LIMIT ?, ?;
`,[ownId,userId,offset,limit])

   return readAllPostsImages(rows)
}


//NOTE: Get users pictures from their posts
export async function getUserPostsPhotos(userId,limit=99,offset=0){
    const [rows] = await pool.query(`SELECT image_path FROM posts_images WHERE post_id IN (SELECT id FROM posts WHERE creator_user_id = ?) LIMIT ?,?`,[userId,offset,limit])
    return rows
}

//NOTE: Get posts that a user has liked with photos appended on .photos
export async function getUserLikedPosts(userId,ownId,limit=99,offset=0){
    const [rows] = await pool.query(`
SELECT 
    p.id, 
    p.body, 
    p.creator_user_id, 
    p.created_at,
    p.original_post_id,
    p.isRetweet,
    p.isComment,
    COALESCE(pc.comment_count, 0) AS comment_count,
    COALESCE(pr.retweet_count, 0) AS retweet_count,
    COALESCE(pl.like_count, 0) AS like_count,
    CASE WHEN plu.liker_user_id IS NOT NULL THEN 1 ELSE 0 END AS user_liked,
    GROUP_CONCAT(pi.image_path) AS post_image_paths,
    op.body AS original_body,
    op.creator_user_id AS original_creator_user_id,
    op.created_at AS original_created_at,
    COALESCE(opc.comment_count, 0) AS original_comment_count,
    COALESCE(opr.retweet_count, 0) AS original_retweet_count,
    COALESCE(opl.like_count, 0) AS original_like_count,
    CASE WHEN oplu.liker_user_id IS NOT NULL THEN 1 ELSE 0 END AS original_user_liked,
    GROUP_CONCAT(opi.image_path) AS original_image_paths,
    u.username AS creator_username,
    u.name AS creator_name,
    u.bannerPath AS creator_bannerPath,
    u.avatarPath AS creator_avatarPath,
    ou.avatarPath AS original_creator_avatarPath,
    ou.username AS original_creator_username,
    ou.name AS original_creator_name
FROM posts p
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS comment_count
    FROM posts
    WHERE isComment = true
    GROUP BY original_post_id
) pc ON p.id = pc.original_post_id
-- Add back the join for retweet count
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS retweet_count
    FROM posts
    WHERE isRetweet = true
    GROUP BY original_post_id
) pr ON p.id = pr.original_post_id
-- Add back the join for liked post count
LEFT JOIN (
    SELECT liked_post_id, COUNT(*) AS like_count
    FROM post_likes
    GROUP BY liked_post_id
) pl ON p.id = pl.liked_post_id
-- Add back the join for posts liked by a specific user
LEFT JOIN (
    SELECT liked_post_id, liker_user_id
    FROM post_likes
    WHERE liker_user_id = 27
) plu ON p.id = plu.liked_post_id
LEFT JOIN posts_images pi ON p.id = pi.post_id
LEFT JOIN posts op ON p.original_post_id = op.id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS comment_count
    FROM posts
    WHERE isComment = true
    GROUP BY original_post_id
) opc ON op.id = opc.original_post_id
LEFT JOIN (
    SELECT original_post_id, COUNT(*) AS retweet_count
    FROM posts
    WHERE isRetweet = true
    GROUP BY original_post_id
) opr ON op.id = opr.original_post_id
LEFT JOIN (
    SELECT liked_post_id, COUNT(*) AS like_count
    FROM post_likes
    GROUP BY liked_post_id
) opl ON op.id = opl.liked_post_id
LEFT JOIN (
    SELECT liked_post_id, liker_user_id
    FROM post_likes
    WHERE liker_user_id = ?
) oplu ON op.id = oplu.liked_post_id
LEFT JOIN posts_images opi ON op.id = opi.post_id
JOIN users u ON p.creator_user_id = u.id
LEFT JOIN users ou ON op.creator_user_id = ou.id
WHERE plu.liker_user_id = ?
GROUP BY p.id
ORDER BY (pc.comment_count + pr.retweet_count + pl.like_count) DESC, p.created_at DESC
LIMIT ?,?;

    `,[ownId,userId,offset,limit])


    //apend images
    return readAllPostsImages(rows)
}