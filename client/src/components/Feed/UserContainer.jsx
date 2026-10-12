import './SCSS/user-container.scss';
import avatar from '../../imgs/defaultAvatar.png'
import {cancelFriendRequest, sendFriendRequest} from "../../utils/UserCalls";
import {useEffect, useState} from "react";
import  banner from './../../imgs/banner.png'
import {notifyError, notifySuccess} from "../../utils/toast";
export default function UserContainer({user}){
    const [requestSent, setRequestSent] = useState(false);
    useEffect(() => {
        setRequestSent(user?.isFriendRequestSent)
    },[user?.is_friend_request_sent])
    const handleAddFriend = async () => {
        if(requestSent) {
            cancelFriendRequest(user?.id).then(
                (res) => {
                    if(res.status === 200){
                        notifySuccess("Friend request canceled!")
                        setRequestSent(false)

                    }else
                       notifyError("Something went wrong!")

                }).catch()
        }else{
            await sendFriendRequest(user?.id).then(
                (res) => {
                    if(res.status === 200){
                        notifySuccess("Friend request sent!")
                       setRequestSent(true)
                    }else
                        notifyError("Something went wrong!")

                }).catch()
        }


    }
    let addBtnText = user?.is_friend ? 'Added' : 'Add';
    if(requestSent) addBtnText = 'Sent';


    // if(button){
    //     button.querySelector('::after').style.backgroundColor = 'red'
    //
    // }
    return (
        <div className="user-container">
            <div className="user-container--top-background" style={{background:`url(${"data:image/jpeg;base64,"+user?.banner}) center no-repeat`}}></div>
            <div className="user-container--bottom-background"></div>
            <div className="user-container__avatar-area">
                <img
                    onClick={() => window.location.href = `/${user?.username}`}
                    src={`data:image/jpeg;base64,${user?.avatar}`} alt="" className="user-container__avatar-area--img"/>
                <button className={`user-container__avatar-area--${user?.is_friend || requestSent ? 'sent' : 'send'}-button`} onClick={handleAddFriend}>{addBtnText}</button>
            </div>

            <div className="user-container__info">
                <div className="user-container__info__top-layer">
                    <a href={`/${user?.username}`} className="no-text-dec user-container__info__top-layer--username">@{user?.username}</a>
                    <a href={`/${user?.username}`} className="no-text-dec user-container__info__top-layer--name">{user?.name}</a>

                </div>
                <div className="user-container__info__bottom-layer">
                    <span className="user-container__info__bottom-layer--bio">{user?.status}</span>
                </div>
            </div>
        </div>
    )
}