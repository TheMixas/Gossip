import {pool} from "./database.js";
import {getUserById} from "./user-db.js";
import {storeFile} from "../store-files.js";
import fs from "fs";

const userAvatarsDir = `C:\\Users\\themi\\WebstormProjects\\Gossip\\server\\`+`/user_images/`
export async function getConversation(conversationId){
    //NOTE: Simple query to get conversation by id
    const result = await pool.query(`SELECT * FROM conversations WHERE conversation_id = ?`,[conversationId])
    return result[0][0]
}
export async function getConversationMembers(conversationId){
    //NOTE: reutrn * from conversation members
    const [rows] = await pool.query(`SELECT * FROM conversation_members WHERE conversation_id = ?`,[conversationId])
    return rows
}
export async function getConversationMessages(conversationId,limit=99,offset=0, selection="*"){
    console.log("get conversation messages")
    const [rows] = await pool.query(`SELECT ${selection} FROM conversations_messages WHERE conversation_id = ? ORDER BY createdAt ASC limit ?,?`,[conversationId,offset,limit])
    return rows
}

export async function GetConversationWithMembers(conversationId){
    //NOTE: Query to return a conversation with all of its member data
    let conversation = await getConversation(conversationId)
    let members = {}
   let convoMembers = await getConversationMembers(conversationId)
    //APPENDING: avatar and banner data to each member
    for(let member of convoMembers){
        let user = await getUserById(member.user_id, "id,username,status,avatarPath,bannerPath,name,location,website")
        //get user friends count
        let [friendsCount] = await pool.query(`SELECT COUNT(*) as count FROM friendships WHERE user1_id = ? OR user2_id = ? `,[user.id,user.id])
        user.friendsCount = friendsCount[0].count
        if(user.avatarPath)
            user.avatar = fs.readFileSync(userAvatarsDir+user.avatarPath).toString('base64')
        if(user.bannerPath)
            user.banner = fs.readFileSync(userAvatarsDir+user.bannerPath).toString('base64')
        members[user.id] = user
    }
    conversation.members =  members

    return conversation
}
export async function getUserConversations(userId, ourUserId,withAvatars=false){
    const [rows] = await pool.query(`SELECT c.conversation_id,c.conversation_name
    FROM conversation_members cm 
    LEFT JOIN conversations c ON cm.conversation_id = c.conversation_id
         WHERE cm.user_id = ?`,[userId])

    //EDITING THE RESULT -> Getting the conversations last message :)
    //AND -> Appending other user id if not group chat

    //NOTE: We should implement a conversation icon later on
    //NOTE: And check if group chat or not
    for(let i = 0; i < rows.length; i++){
        let lastMessage = await getConversationsLastMessage(rows[i].conversation_id)
        rows[i].lastMessage = lastMessage
        if(rows[i].isGroupChat) continue;
        if(!withAvatars) continue;
        let members = await getConversationMembers(rows[i].conversation_id)
        //simple .find, limited to one element
        let otherUserID = members.find(member => member.user_id !== ourUserId).user_id
        console.log("otherUser:",otherUserID)
        rows[i].userID= otherUserID
    }
    return rows
}
export async function getConversationsLastMessage(conversationId){
    const [rows] = await pool.query(`SELECT message_value,createdAt FROM conversations_messages WHERE conversation_id = ? AND isFile = 0 ORDER BY createdAt DESC LIMIT 1`,[conversationId])
    return rows[0]
}
export async function createPrivateConversation(user1Id,user2Id){
    //NOTE: stray away from this method
    try{
        //print paramers
        console.log("user1Id:",user1Id)
        console.log("user2Id:",user2Id)
        //NOTE: get user usernames ant set as conversation name
        let user1 = await getUserById(user1Id)
        console.log("user1:",user1)
        let user2 = await getUserById(user2Id)
        console.log("user2:",user2)
        let conversationName = user1.username + ", " + user2.username

        const result = await pool.query(`INSERT INTO conversations (conversation_name,isGroupChat)
            VALUES (?,?)`, [conversationName,false]);

        const conversationId = result[0].insertId
        await addUserToConversation(conversationId,user1Id)
        await addUserToConversation(conversationId,user2Id)
        return conversationId
    }catch (e){
        console.log(e)
    }

}

export async function storeMessage(conversationId,senderId,body,isFile=false){
    console.log("conversationId in store message: ",conversationId)
    if(isFile)
    {
        body = await storeFile(body);
    }

    const result = await pool.query(`INSERT INTO conversations_messages (conversation_id, sender_id, message_value,isFile)
    VALUES (?,?,?,?)`, [conversationId,senderId,body,isFile])
    return result
}

export async function addUserToConversation(conversationId,userId){
    const result = await pool.query(`INSERT INTO conversation_members(conversation_id, user_id)
    VALUES (?,?)`, [conversationId,userId])
    return result
}
export async function removeUserFromConversation(conversationId,userId){
    const result = await pool.query(`DELETE FROM conversation_users WHERE conversation_id = ? AND user_id = ?`, [conversationId,userId])
    return result
}

export async function isUserInConversation(conversationId,userId){
    //NOTE: could be usefull for validation
    const [rows] = await pool.query(`SELECT * FROM conversation_users WHERE conversation_id = ? AND user_id = ?`,[conversationId,userId])
    return rows.length > 0
}



