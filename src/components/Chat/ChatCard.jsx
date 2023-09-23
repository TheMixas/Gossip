import {Component, useCallback, useEffect, useState} from "react";
import SmallAvatar from "../_Shared/SmallAvatar";
import defaultAvatar from "../../imgs/defaultAvatar.png"

//import group avatar
import groupAvatar from "../../imgs/groupAvatar.png"
import {fetchAvatar} from "../../utils/UserCalls";
export default function ChatCard({conversation, handleClick,isConversationCard}){
        const [convoIcon, setConvoIcon] = useState(null)
        if(isConversationCard){
            console.log("handleChatCardConv: conversation: ", conversation)
        }
        let getConvoIcon = useCallback(async () => {
            if(conversation.isGroupChat)
                setConvoIcon(groupAvatar)
            else{
                console.log("attempting to fetch avatar")
                fetchAvatar(conversation.userID).then((res) => {
                    if(res.status !== 200){

                        console.log("Error fetching avatar, status: ", res.status)
                        throw new Error("Error fetching avatar")
                    }else return res.blob()
                }).then(blob => {
                    setConvoIcon(URL.createObjectURL(blob));
                }).catch((error)=>{
                    console.log(error)
                    setConvoIcon(defaultAvatar)
                });
            }
        },[conversation?.isGroupChat])

        useEffect(() => {
            getConvoIcon().catch(err => console.log(err));
        },[getConvoIcon])

        return(
            <div className="user-list__users--user" onClick={()=>{
                handleClick(conversation)
            }}>
                <SmallAvatar src={convoIcon} />
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
