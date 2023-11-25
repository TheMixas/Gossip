import express from "express";
import {verifyToken} from "../middleware/auth.js";
import {
    getConversation,
    getConversationMembers,
    getConversationMessages, GetConversationWithMembers,
    getUserConversations
} from "../db/conversation-db.js";
import {getFriendIds,getUserById} from "../db/user-db.js";
import fs from "fs";
import {messageImagesDir} from "../app.js";


const router = express.Router()

router.get('/chat/get-conversations', verifyToken, async (req, res) => {
    const user = req.user
    const conversations = await getUserConversations(user.id, req.user.id,true)
    
    //set json response
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).send({conversations: conversations})
})
//get conversation messages
// router.get('/chat/get-conversation/:conversationId', verifyToken, async (req, res) => {
//     const user = req.user
//     const conversationId = req.params.conversationId
//     const conversation = await getConversation(conversationId)
//     if(!conversation){
//         return res.status(404).send({error:"conversation not found"})
//     }
//     //NOTE: check if user is a member of the conversation
//     let members = await getConversationMembers(conversationId)
//     if(!members.find(member => member.user_id === user.id)){
//         return res.status(401).send({error:"unauthorized"})
//     }
//     let messages = await getConversationMessages(conversationId)
//     //for each file message
//     for(let i = 0; i < messages.length; i++){
//         if(messages[i].isFile){
//             let fileData = fs.readFileSync(messageImagesDir + messages[i].message_value).toString('base64')
//             //convert to blob
//             messages[i].message_value = fileData
//             //
//             
//         }
//     }
//
//     res.setHeader('Content-Type', 'application/json')
//     return res.status(200).send({messages})
// })

//get a ?private conversation
router.get('/chat/get-private-conversation/:conversationID', verifyToken, async (req, res) => {
    try{

        
        const user = req.user
        const convID = req.params.conversationID
        const conversation = await GetConversationWithMembers(convID)

        if(!conversation){
            return res.status(404).send({error:"conversation not found"})
        }

        let messages = await getConversationMessages(convID)
        //for each file message
        for(let i = 0; i < messages.length; i++){
            if(messages[i].isFile) {
                let fileData = undefined;
                    try{
                        fileData = fs.readFileSync(messageImagesDir + messages[i].message_value).toString('base64')

                    }catch (e) {
                        console.log(e)
                        continue
                    }
                //convert to blob
                messages[i].message_value = fileData
                //
            }
        }

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send({conversation,messages})
    }catch (e) {
        
        return res.status(500).send({error:e})
    }
})


//get sugested friends
router.get('/users/suggested-friends', verifyToken, async (req, res) => {
    try{
        const user = req.user
        //TODO: implement suggested logic later
        //NOTE: for now, return friends
        const suggestedFriendsIDs = await getFriendIds(user.id)
        
        let suggestedFriends = []
        for(let i = 0; i < suggestedFriendsIDs.length; i++){
            let suggestedFriend = await getUserById(suggestedFriendsIDs[i].friend)
            suggestedFriend.conversationID = suggestedFriend.id
            suggestedFriends.push(suggestedFriend)
        }

        //set jsonm header
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send({suggestedFriends})
    }catch (e) {
        
        return res.status(500).send({error:e})
    }
})

export default router
