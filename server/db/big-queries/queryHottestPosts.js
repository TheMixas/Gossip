//This script is responbile for getting the data for the home page
//It will query all of the data in a single query
// GOAL: reduce the number of queries to the database

import {pool} from "../database.js";

/**
 * Get the hottest posts.<br>
 * A retweet post will contain an original post object<br>
 * Ordered by the number of likes, comments and retweets
 * Columns returned:
 * <h1>Post</h1>
 * <ul>
 *     <li>id</li>
 *     <li>body</li>
 *     <li>creator_user_id</li>
 *     <li>created_at</li>
 *     <li>original_post_id</li>
 *     <li>isRetweet</li>
 *     <li>isComment</li>
 *     <li>comment_count</li>
 *     <li>retweet_count</li>
 *     <li>like_count</li>
 *     <li>user_liked</li>
 *     <li>post_image_paths</li>
 *  </ul>
 *  <h1>Original Post</h1>
 *  <ul>
 *      <li>original_body</li>
 *      <li>original_creator_user_id</li>
 *      <li>original_created_at</li>
 *      <li>original_comment_count</li>
 *      <li>original_retweet_count</li>
 *      <li>original_like_count</li>
 *      <li>original_user_liked</li>
 *      <li>original_image_paths</li>
 *      <li>original_post_id</li>
 *      <li>original_isRetweet</li>
 *      <li>original_isComment</li>
 *      <li>original_image_paths</li>
 *  </ul>
 *
 * @param userID
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */

export async function getHottestPosts(userID,offset=0,limit=500){
    try {
        const [rows] = await pool.query(`SELECT 
    p.id, 
    p.body, 
    p.creator_user_id, 
    u.username AS creator_username,
    u.name AS creator_name,
    u.avatarPath AS creator_avatarPath,
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
    ou.username AS original_creator_username,
    ou.name AS original_creator_name,
    ou.avatarPath AS original_creator_avatarPath,
    op.created_at AS original_created_at,
    COALESCE(opc.comment_count, 0) AS original_comment_count,
    COALESCE(opr.retweet_count, 0) AS original_retweet_count,
    COALESCE(opl.like_count, 0) AS original_like_count,
    CASE WHEN oplu.liker_user_id IS NOT NULL THEN 1 ELSE 0 END AS original_user_liked,
    GROUP_CONCAT(opi.image_path) AS original_image_paths
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
    WHERE liker_user_id = ?
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
LEFT JOIN users u ON p.creator_user_id = u.id
LEFT JOIN users ou ON op.creator_user_id = ou.id
WHERE p.isComment = false
   OR p.isRetweet = true
GROUP BY p.id
ORDER BY (pc.comment_count + pr.retweet_count + pl.like_count) DESC, p.created_at DESC
LIMIT 0, 10000;
`, [userID, userID])
        return rows
    } catch (e) {
        console.error("SQL query hottest post error: ",e)
        return null
    }
}