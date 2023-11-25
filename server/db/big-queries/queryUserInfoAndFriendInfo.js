import {pool} from "../database.js";

/*
* Params: <br>
* <ul>
* <li>userID</li>
* <li>ourID</li>
* </ul>
* Returns:
* <ul>
* <li>id</li>
* <li>username</li>
* <li>name</li>
* <li>location</li>
* <li>website</li>
* <li>status</li>
* <li>avatarPath</li>
* <li>bannerPath</li>
* <li>created</li>
* <li>isFriend</li>
* <li>isFriendRequestSent</li>
* */
export async function queryUserInfoAndFriendInfo(userUsername, ourID) {
    console.log("Querying user info and friend info for user: : ourid ",userUsername,ourID);
    try{
        const [rows] = await pool.query(
            `SELECT 
    u.id, u.username, u.name, u.location, u.website, u.status, u.avatarPath, u.bannerPath, u.created,
    CASE 
        WHEN EXISTS (
            SELECT 1
            FROM friendships f
            WHERE (f.user1_id = u.id AND f.user2_id = ?) OR (f.user1_id = ? AND f.user2_id = u.id)
        ) THEN 1
        ELSE 0
    END AS isFriend,
    CASE 
        WHEN EXISTS (
            SELECT 1
            FROM friend_requests fr
            WHERE (fr.sender_user_id = ? AND fr.recipient_user_id = u.id) OR (fr.sender_user_id = u.id AND fr.recipient_user_id = ?)
        ) THEN 1
        ELSE 0
    END AS isFriendRequestSent
FROM users u
WHERE u.username = ?
`, [ourID, ourID, ourID, ourID,userUsername.toString()])
        return rows[0];
    }catch (e){
        console.log("Encountered error while querying user info and friend info: ",e);
        return null;
    }


}