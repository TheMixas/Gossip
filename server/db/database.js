import mysql from 'mysql2'
import dotenv from 'dotenv'
import * as fs from "fs";
import {storeFile} from "../store-files.js";

dotenv.config()

export const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE

}).promise()








export async function getQueriedUsers(query) {
    const [rows] = await pool.query(`SELECT * FROM users u WHERE u.username LIKE '%${query}%'`);
    return rows
}
export async function getQueriedPosts(query) {
    const [rows] = await pool.query(`SELECT * FROM posts p WHERE p.body LIKE '%${query}%'`);
    return rows
}









//accept friend request

//remove friends from friend requests



//remove friend
export async function removeFriend(senderId,recipientId){
const result = await pool.query(`DELETE FROM friendships WHERE user1_id = ? AND user2_id = ?`, [senderId,recipientId])
    return result

}

//DELETE account


//like post


//get post comments


//get post`s recent likers


//get hottest posts





// MESSAGES
//create a conversation
// export async function createConversation(name){
//     return pool.query(`INSERT INTO conversations (name)
//     VALUES (?)`, [name]);
// }
//create private conversation

//add user to conversation

//remove user from conversation




//send message

//store conversation image

//is user in conversation

//get conversation

//get conversation between two users
//NOTE: OUTDATE, BAD PRACTICE

//get conversation between two members
//get user conversations

//

//get conversation_name
//get conversation members

//get conversation messages


//get friendships of user that are not part of ANY conversation members with you







