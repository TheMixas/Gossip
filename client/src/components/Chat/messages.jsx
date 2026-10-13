import './scss/messages-page.scss'
import './../../scss/typography.scss'
import Navbar from "../navbar";
import InputField from "../_Shared/InputField";
import SearchInputField from "../_Shared/SearchInputField";
import {useCallback, useEffect, useState} from "react";
import ChatCard from "./ChatCard";
import TextMessage from "./TextMessage";
import {ChatUserHeader} from "./ChatUserHeader";
import {UserInfoList} from "./UserInfoList";
import ImageMessage from "./ImageMessage";
import {getID} from "../../utils/Utils";
import '../../scss/vars.scss'
import {
    fetchFullConversation,
    fetchSuggestedFriends,
    fetchUserConversations
} from "../../utils/ChatCalls"
import {notifyError} from "../../utils/toast";



async function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = (err) => {
            reject(err);
        }
    })
}

async function convertMediaToBase64(media) {
    let base64Media = [];
    for (let i = 0; i < media.length; i++) {
        base64Media.push(await convertFileToBase64(media[i]));
    }
    return base64Media;

}

export default function Messages({socket}) {
    const customInputBoxSCSS = {
        width: '100%',
        boxSizing: 'border-box',
    }
    const customContainerBoxSCSS = {
        width: '54rem !important',

    }
    const inputBorderColor = "#1e2124"
    const inputColor = "#424549"

    const [showProfile, setShowProfile] = useState(false);
    const [showDetails, setShowDetails] = useState('hidden');//empty for normal, hidden to hide
    const [expanded, setExpanded] = useState('extended');//empty for normal, 'extended' for    expand header,chat and input

    const [currentConversation, setCurrentConversation] = useState({conversationID: -1, conversationName: '', isGroupChat: false, userID: 0, members: {}});
    useEffect(() => {
        console.log("currentConversation: ", currentConversation)
    }, [currentConversation]);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    //NOTE: structure = {conversationID, conversationName, isGroupChat, userID}
    const [conversations,setConversations] = useState([])


    //NOTE: fetching conversations and suggested users
    let getConversations = useCallback(async () => {
        fetchUserConversations().then(async res => {
            if (res.status !== 200) {
                throw new Error("Error fetching conversations")
            } else {
                
                let resJSON= await res.json();

                
                // Private chats are stored as "alice, bob": show the other person's name
                const ownUsername = JSON.parse(localStorage.getItem('gossip_user') ?? '{}')?.username;
                for (const conversation of resJSON.conversations) {
                    const names = conversation.conversation_name.split(', ');
                    conversation.conversationName = conversation.isGroupChat
                        ? conversation.conversation_name
                        : (names.find(name => name !== ownUsername) ?? conversation.conversation_name);
                    conversation.lastMessage = {message_value: conversation.last_message ?? ''};
                }

                setConversations(resJSON.conversations);

            }
        }).catch(err => console.log(err));

    },[])


    //NOTE: run fetches on mount
    useEffect(() => {
        getConversations().catch(err => console.log(err));
    },[getConversations])

    function onConnect() {
        setIsConnected(true);
    }
    function onDisconnect() {
        setIsConnected(false);
    }


    //NOTE: SOCKET.IO useEFFECTS

    useEffect(() => {
        socket.on("connect", () => {
            
            onConnect()
        });
        return () => {
            socket.off("connect");
        }
    },[])

    useEffect(() => {
        socket.on("disconnect", () => {
            
            onDisconnect()
        });
        return () => {
            socket.off("disconnect");
        }
    },[])

    useEffect(() => {
        socket.on('chat message',(message)=>{
            // let receivedMessage;
            // if (message.isFile) {
            //     receivedMessage = {isFile:message.isFile, sender_id: getID(), message_value: message.value};
            // }else{
            //     receivedMessage = {isFile:message.isFile, sender_id: getID(), message_value: message.value};
            // }
            handleReceiveMessage(message)

        })
        return () => {
            socket.off('chat message');
        }
    },[])









    //NOTE: handle load past messages
    const handleLoadConversation = useCallback((id) => {
        //NOTE: fetch messages,participants,etc. from server
        //
        
         fetchFullConversation(id).then(async res => {
            if (res.status !== 200) {
                throw new Error("Error fetching messages")
            } else {
                let convJSON = await res.json();
                

                setMessages(convJSON.messages);
               setCurrentConversation(convJSON.conversation);
            }
        }).catch(err => console.log(err));
    },[])

    //NOTE: handle socket connections
    //NOTE: only join room for group conversations
    const handleJoinGroupRoom = (conversationID) => {
        socket.emit('join group conversation', conversationID);
    }
    const handleLeaveGroupRoom = (conversationID) => {
        socket.emit('leave group conversation', conversationID);
    }

    //NOTE: handle conversation join, for joining a new conversation
    const handleConversationJoin = async (conversation) => {
        
        if (currentConversation.isGroupChat) {
            handleLeaveGroupRoom(currentConversation);
        }
        // setMessages([])
        if (conversation.isGroupChat) {
            handleJoinGroupRoom(conversation.conversation_id);
        }
        await handleLoadConversation(conversation.conversation_id);
    }

    //NOTE: clear conversation data, for exiting conversation
    const handleClearConversation = () => {
        handleLeaveGroupRoom(currentConversation);
        setCurrentConversation({conversation_id: 0, conversation_name: '', isGroupChat: false, members: []});
        setMessages([]);
    }


    //handle messages
    const handleSendMessage = async (message, media, mediaPreview) => {
        //NOTE: make media to base64
        let base64Media = [];
        if(media){
            console.log("Converting media to base64: ", media)
            base64Media = await convertMediaToBase64(media);
        }
        

        //NOTE: server side text
        if(currentConversation.isGroupChat === 1){
            
            socket.emit('group chat message', currentConversation.conversationID,message, base64Media)
        }else{
            //Remove yourself from receiver list
            console.log("currentConversation.members: ", currentConversation.members)
            let receiverID = Object.keys(currentConversation.members)?.filter((id)=>{
                return id != getID();
            })[0]
            if(receiverID === undefined){
                notifyError("Error sending message")
                return;
            }
            console.log("Sending private message to: ", receiverID)
            //print out all parameters and their names
            console.log("message: ", message, "base64Media: ", base64Media, "currentConversation.conversation_id: ", currentConversation.conversation_id)
            socket.emit('private chat message'  ,receiverID,message, base64Media,currentConversation.conversation_id);
        }

        //NOTE: client side text and images
        let imagePreviews = [];
        // if(mediaPreview.length > 0){
        //     mediaPreview.map(src => imagePreviews.push({isFile: true, sender_id: getID(), message_value: src}));
        // }
        if(base64Media.length > 0){
            base64Media.map((src) => {
                
                let base64Image = src.split(';base64,').pop();
                
                imagePreviews.push({isFile: true, sender_id: getID(), message_value: base64Image})
            })
        }
        let textMessage =message.length > 0 ? {isFile: false, sender_id: getID(), message_value: message} : ''

         setMessages([...messages, textMessage, ...imagePreviews]);

    }
    const handleReceiveMessage = async (message) => {
        console.log("received message: ", message)
        //NOTE: message = {value,isFile,senderid}
        
        
        let receivedMessage;
        if (message.isFile) {
            let base64Image = message.value.split(';base64,').pop();
            receivedMessage = {isFile:message.isFile, sender_id: message.sender_id, message_value: base64Image};
        }else{
            receivedMessage = {isFile:message.isFile, sender_id: message.sender_id, message_value: message.value};
        }
        setMessages(prevMessages => [...prevMessages, receivedMessage])
    }
    const handleReceiveImage = (src, texterSocketID) => {
        // if(texterSocketID !== chatMate.socketID) return;
        setMessages([...messages, {type: 'image', author: 'others', src: src}])

    }
    const handleProfileClick = () => {
        setShowProfile(!showProfile);
        if(showProfile){
            setShowDetails('');
            setExpanded('');
        }else{
            setShowDetails('hidden');
            setExpanded('extended');
        }
    }

    return (
        <>

            {/*<Navbar/>*/}
            <div className="page__messages">
                <div className="grid">
                    <div className="user-list">
                        <div className="user-list__header">
                            <h2 className="user-list__header--title">Conversations</h2>
                        </div>
                        {
                            conversations.length === 0 ?<>
                                    <span className={"user-list__empty--text"}>No conversations...</span>
                                    <span className={"user-list__empty--text"}>Add a friend to have a conversation with someone :)</span>
                                <div className="user-list__empty"></div>
                                </>
                                :
                                <div className="user-list__users">
                                {conversations.map((conversation, index) => {
                                        return <ChatCard key={index} conversation={conversation} handleClick={handleConversationJoin} isConversationCard={true}/>
                                    }
                                )}
                                </div>

                        }

                    </div>
                    <div
                        style={{display: `${currentConversation.conversationID === -1 ? 'flex' : 'none'}`}}
                        className="no-conversation">
                        <div className="no-conversation__text">
                            <h1 className="no-conversation__text--title text--huge--primary--bold">Select a conversation!</h1>
                        </div>
                    </div>
                    <ChatUserHeader expanded={expanded} onClick={handleProfileClick} currConversation={currentConversation}/>
                    <div className={`chat chat--${expanded}`}>
                        <div className="chat__body">
                            <div className="chat__body__messages">
                                {messages?.map((message, index) => {
                                    //NOTE: if message is empty, return nothing
                                    if(message ==='') return (<></>)
                                    if(!message.isFile) {
                                        return <TextMessage key={index} author={message.sender_id === getID() ? "ours" : "others"}
                                                            senderID={message.sender_id}
                                                            members={currentConversation.members}
                                                            message={message.message_value}/>
                                    }else{
                                        return <ImageMessage key={index} author={message.sender_id=== getID() ? "ours" : "others"}
                                                                senderID={message.sender_id}
                                                                members={currentConversation.members}
                                                             src={message.message_value}/>
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <div
                        style={{display: `${currentConversation.conversationID === -1 ? 'none' : 'block'}`}}
                        className={`input-field-container input-field-container--${expanded} input-field-container--${showDetails ==='' && 'hidden-on-mobile'}`}>
                        <InputField buttonText={"Send"} text={"Say something..."}
                                    inputSCSS={customInputBoxSCSS}
                                    containerSCSS={customContainerBoxSCSS}
                                    color={inputColor}
                                    border={inputBorderColor}
                                    isMessage={true}
                                    handleSubmitMessage={handleSendMessage}

                        />
                    </div>
                    <UserInfoList toggleDetails={handleProfileClick} showDetails={showDetails} members={currentConversation.members}/>
                </div>

                {conversations.length ===0 &&
                    <a className="attribution-text"
                       href="https://storyset.com/animal">
                        Animal illustrations by Storyset
                    </a>}
            </div>
        </>
    )
}