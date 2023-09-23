import express from 'express'
const app = express()
import http from 'http'
const server = http.createServer(app);
import { Server } from "socket.io";
import session from "express-session";
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true

    }
});
import bodyParser from "body-parser";

import user_router from './/routers/user-router.js'
import postRouter    from "./routers/post-router.js";
import chat_router   from "./routers/chat-router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {getUserFromSocketCookie} from "./middleware/auth.js";
import {
    createPrivateConversation, getConversation, getConversationMembers, getConversationMessages, GetConversationWithMembers,
    getUserConversations,
    storeMessage
} from "./db/conversation-db.js";
import {getFriendRequests, getMutuals, getUserByUsername, getUserStats} from "./db/user-db.js";
import {getUserById} from "./db/user-db.js";
import {getUserLikedPosts, getUserPosts, getUserPostsPhotos, getUserRetweets} from "./db/post-db.js";


let corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(postRouter)
app.use(user_router)
app.use(chat_router)
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

let authedSockets= []



//add to authedSockets array
function addAuthedSocket(socket, user){
    console.log("Pushing: ", user.username, " to authedSockets array")
    if(!isSocketConnected(socket.id)){
        authedSockets.push({socket: socket, user: user})
    }

    console.log("authedSockets length after join: ", authedSockets.length)
    for (let i = 0; i < authedSockets.length; i++) {
        console.log(authedSockets[i].socket.id)

    }
}
//remove from authedSockets array
function isSocketConnected(socketId){
    return authedSockets.some(authedSocket=> authedSocket.socket.id === socketId)
}
function removeAuthedSocket(socketId)
{
    console.log("Removing: ", socketId, " from authedSockets array" ,"length: ", authedSockets.length)
    authedSockets = authedSockets.filter((authedSocket)=> {
        return authedSocket.socket.id !== socketId
    })
    console.log("length after: ", authedSockets.length)
    console.log("authedSockets length after disconeect: ", authedSockets.length)
}

//get user from authedSockets array
function getUserFromAuthedSockets(socketId){
    return authedSockets.find((authedSocket)=> {
        return authedSocket.socket.id === socketId
    })?.user
}
//get socket from authedSockets array
function getSocketFromAuthedSockets(id){
    return authedSockets.filter((authedSocket)=> {
        console.log("pimpalas")
        console.log("authedSocket.user.id", authedSocket.user.id)
        console.log("id", id)
        console.log("id vs authedSocket.user.id", id == authedSocket.user.id)
        return authedSocket.user.id == id
    })[0].socket
}


io.use(async (socket, next) => {
    console.log("socket handshake: ", socket.handshake.headers.cookie)
    const user = await getUserFromSocketCookie(socket.handshake.headers.cookie)
    if (!user) {
        return next(new Error("invalid token"))
    }
    socket.user = user
    addAuthedSocket(socket, user)
    next()
})
io.on('connection', async (socket) => {
    console.log('a user connected');

    //every conversations room
    await getUserConversations(socket.user.id).then(conversations => {
        conversations.forEach(conversation => {
            if(conversation.isGroupChat){
                socket.join(conversation.id)
            }

        })
    })
    socket.on('private chat message', async (receiverID, body, media,conversationID) => {
        try{
            console.log('message: ' + JSON.stringify(body));
            let conversation_id = conversationID
            console.log("conversationID: ", conversation_id)
            console.log("conversationID2: ", conversation_id)
            let user = getUserFromAuthedSockets(socket.id)
            console.log("sender user: ", user)

            if(body.length !== 0){
                await sendMessageToUser(user.id, receiverID, body, false,conversation_id)
            }

            media.map(async media => {
                //NOTE: send media
                await sendMessageToUser(user.id, receiverID, media, true,conversation_id)
            })
        }catch (e) {
            console.log(e)
        }

    })
    socket.on('group chat message', async (conversationID, body,media )=> {
        try{
            console.log('message: ' + JSON.stringify(body));
            //NOTE: send text
            await sendMessageToConversation(socket.id, conversationID, body, false)
            media.map(async media => {
                //NOTE: send media
                await sendMessageToConversation(socket.id, conversationID, media, true)
            })
        }catch (e) {
            console.log(e)
        }


    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeAuthedSocket(socket.id)
    });
});



//send message to conversation
async function sendMessageToConversation(socketID, conversationID, body, isFile) {
    //do some validation,

    //store message in server
    let user = getUserFromAuthedSockets(socketID)
    await storeMessage(conversationID, user.id, body, isFile)

    //emmit msg
    io.to(conversationID).emit('chat message', body, isFile)
//send message to all users in conversation
}

//send message to user
async function sendMessageToUser(senderID, receiverID, body, isFile,conversationID) {
    //do some validation,
    try{
        //get user from reciever username
        let receiver = await getUserById(receiverID)
        //store message in server
        let user = await getUserById(senderID)

        //if user is not in conversation, create conversation, check first
        let conversation = await getConversation(conversationID)

        console.log("conversation: ", conversation)
        console.log("conversation id: ", conversation.conversation_id)
        await storeMessage(conversation.conversation_id, senderID, body, isFile)

        //NOTE: emit message to user
        //NOTE: get socket from authedSockets array
        console.log(`emitting to user: ${receiver.username}`)
        let socket = getSocketFromAuthedSockets(receiverID)
        console.log("socket: ", socket)
        if(!socket){
            console.log("Socket not currently connected")
            return
        }

        console.log(`emitting to user: ${receiver.username} with socket: ${socket.id}`)
        io.to(getSocketFromAuthedSockets(receiverID).emit('chat message', {value:body, isFile,sender_id:senderID}))
    }catch (e){
        console.log("error: ", e)
        return e
    }

}


// console.log("conversation members: ", await getConversationMembers(4))
// console.log("conversation messages: ", await getConversationMessages(4, 0, 10,))
// console.log("user posts: ", await getUserPosts(27))0
// console.log("User retweets: ", await getUserRetweets(27))
// console.log("User likes: ", await getUserLikedPosts(27))
//
console.log("user friend reqeusts: ", await getFriendRequests(3))

server.listen(8080, () => console.log('Listening on port 8080'))