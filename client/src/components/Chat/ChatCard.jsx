import {Component, useCallback, useEffect, useState} from "react";
import SmallAvatar from "../_Shared/SmallAvatar";
import defaultAvatar from "../../imgs/defaultAvatar.png"

//import group avatar
import groupAvatar from "../../imgs/groupAvatar.png"
import {fetchAvatar} from "../../utils/UserCalls";
export default function ChatCard({conversation, handleClick,isConversationCard}){
        const [convoIcon, setConvoIcon] = useState(undefined)
        useEffect(() => {
            console.log("convoIcon: ",convoIcon)
        },[convoIcon])
        if(isConversationCard){
            
        }
        let getConvoIcon = useCallback(async () => {
            if(conversation.isGroupChat)
                setConvoIcon(groupAvatar)
            else{
                let avatarUrl;
                await fetchAvatar(conversation.userID).then(async (res) => {
                    console.log("res: ",res)
                    let data = await res.json()
                    console.log("data: ",data)
                    if (data?.error) return
                    avatarUrl = data?.avatar;
                    setConvoIcon(avatarUrl)
                }).catch((error)=>{
                    console.log("error while trying to get avatar", error)
                });
            }
        },[conversation.isGroupChat, conversation.userID])

        useEffect(() => {
            getConvoIcon().catch(err => console.log(err))
        },[getConvoIcon])

        return(
            <div className="user-list__users--user" onClick={()=>{
                handleClick(conversation)
            }}>
                <SmallAvatar src={convoIcon === undefined ? require("../../imgs/defaultAvatar.png") : `data:image/jpeg;base64,${convoIcon}`}/>
                <div className="user-list__users--user__info">
                    <span href="" className="user-list__users--user__info--name">{conversation.conversationName}</span>
                    <div className="user-list__users--user__info__last-message">
                        <span className="user-list__users--user__info__last-message--text">{conversation?.lastMessage?.message_value}</span>
                        <span className="user-list__users--user__info__last-message--date">{conversation?.lastMessageDate}</span>
                    </div>
                </div>
            </div>
        )
}
