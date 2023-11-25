import express from 'express'
const app = express()
import http from 'http'
const server = http.createServer(app);
import { Server } from "socket.io";
import session from "express-session";
const __filename = fileURLToPath(import.meta.url);


export const __dirname = path.dirname(__filename);
export const userAvatarsDir = __dirname + "/user_images/"
export const postsImagesDir = __dirname + "/user_posts_images/"
export const messageImagesDir = __dirname + "/message_imgs/"

let origin = process.env.NODE_ENV === "production" ? 'https://gossip-server-c6dd76b8a875.herokuapp.com' : 'http://localhost:3000'

// const io = new Server(server, {
//     cors: {
//         origin,
//         credentials: true
//     }
// });
const io = new Server(server)
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
import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";


if(process.env.NODE_ENV === "production"){
    console.log("production")
}else {
    console.log("development")
}
console.log("origin: ", origin)
let corsOptions = {
    origin,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    credentials: true
}
app.use(express.static(path.join(__dirname + '/public')));
app.get('/koko', (req, res) => {
    res.send({koko: "koko"})
})
app.get('/koko2/1', (req, res) => {
    res.send({koko: "koko2"})
})

app.use(cors(corsOptions))
app.use(express.json())
app.use(postRouter)
app.use(user_router)
app.use(chat_router)
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});



let authedSockets= []



//add to authedSockets array
function addAuthedSocket(socket, user){
    
    if(!isSocketConnected(socket.id)){
        authedSockets.push({socket: socket, user: user})
    }

    
    for (let i = 0; i < authedSockets.length; i++) {
        

    }
}
//remove from authedSockets array
function isSocketConnected(socketId){
    return authedSockets.some(authedSocket=> authedSocket.socket.id === socketId)
}
function removeAuthedSocket(socketId)
{
    
    authedSockets = authedSockets.filter((authedSocket)=> {
        return authedSocket.socket.id !== socketId
    })
    
    
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
        
        
        
        
        return authedSocket.user.id == id
    })[0].socket
}


//Authenticate socket before connecting
io.use(async (socket, next) => {
    
    const user = await getUserFromSocketCookie(socket.handshake.headers.cookie)
    if (!user) {
        return next(new Error("invalid token"))
    }
    socket.user = user
    addAuthedSocket(socket, user)
    next()
})
io.on('connection', async (socket) => {
    

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
            console.log("starting to send private chat message")
            
            let conversation_id = conversationID
            
            
            let user = getUserFromAuthedSockets(socket.id)
            

            //Check for text and send it
            if(body.length !== 0){
                await sendMessageToUser(user.id, receiverID, body, false,conversation_id)
            }

            console.log("messages media: ", media)
            //Loop media and send it
            media.map(async media => {
                //NOTE: send media
                console.log("sending media: ", media)
                await sendMessageToUser(user.id, receiverID, media, true,conversation_id)
            })
        }catch (e) {
            
        }

    })
    socket.on('group chat message', async (conversationID, body,media )=> {
        try{
            
            //NOTE: send text
            await sendMessageToConversation(socket.id, conversationID, body, false)
            media.map(async media => {
                //NOTE: send media
                await sendMessageToConversation(socket.id, conversationID, media, true)
            })
        }catch (e) {
            
        }


    })
    socket.on('disconnect', () => {
        
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

        
        
        await storeMessage(conversation.conversation_id, senderID, body, isFile)

        //NOTE: emit message to user
        //NOTE: get socket from authedSockets array
        
        let socket = getSocketFromAuthedSockets(receiverID)
        
        if(!socket){
            
            return
        }

        
        io.to(getSocketFromAuthedSockets(receiverID).emit('chat message', {value:body, isFile,sender_id:senderID}))
    }catch (e){
        
        return e
    }

}


// 
// 
// 
// 
// 
//
console.log(__dirname)
console.log(userAvatarsDir)
console.log("NODE_ENV",process.env.NODE_ENV)
console.log(await fs.readFileSync(`${userAvatarsDir}/avatar-1692568900542-685106487.jpg`))
let port = process.env.PORT || 8080
server.listen(port, () => console.log(`listening on *:${port}`));