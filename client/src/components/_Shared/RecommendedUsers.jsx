import '../../scss/feed.scss'
import SmallAvatar from "./SmallAvatar";
import {cancelFriendRequest, sendFriendRequest} from "../../utils/UserCalls";
import {useState} from "react";
export default function RecommendedUsers({title,users=[]}) {
    const handleAddFriend = async (friendID, isRequestSent) => {
        if(isRequestSent) {
            cancelFriendRequest(friendID).then(
                (res) => {
                    if(res.status === 200){
                        alert("Friend request canceled!")
                        users.map(user => {
                            if(user.id === friendID){
                                user.isFriendRequestSent = false;
                                setUsersIsRequestSent(prevState => ({
                                    ...prevState,
                                    [user.id]: false
                                }))
                            }
                        })
                    }else
                        alert("Something went wrong!")

                }).catch()
        }else{
            await sendFriendRequest(friendID).then(
                (res) => {
                    if(res.status === 200){
                        alert("Friend request sent!")
                        users.map(user => {
                            if(user.id === friendID){
                                user.isFriendRequestSent = true;
                                setUsersIsRequestSent(prevState => ({
                                    ...prevState,
                                    [user.id]: true
                                }))
                            }
                        })
                    }else
                        alert("Something went wrong!")

                }).catch()
        }


    }
    const [usersIsRequestSent, setUsersIsRequestSent] = useState({});
    let usersIsRequestSentStart = {}
    for (let i = 0; i < users.length; i++) {
        usersIsRequestSentStart[users[i].id] = users[i].isFriendRequestSent;
    }
    useState(() => {
        setUsersIsRequestSent(usersIsRequestSentStart)
    })
    return(
        <div className="who-to-follow">
            <div className="who-to-follow__header">
                <span className="who-to-follow__header--title">{title}</span>
                <div className="who-to-follow__header__options">
                    <a href="" className="who-to-follow__header__options--refresh">Refresh</a>
                    <a href="" className="who-to-follow__header__options--view-all">View All</a>
                </div>
            </div>
            <div className="who-to-follow__body">
                {users.map((user,index) => {
                    let addBtnText = user?.isFriend ? 'Friend added' : 'Add friend';
                    if(user?.isFriendRequestSent) addBtnText = 'Request sent';
                    return(
                        <div key={index} className="who-to-follow__body__user">
                            <SmallAvatar src={`data:image/jpeg;base64,${user?.avatar}`}/>
                            <div className="who-to-follow__body__user__info">
                                <div className="who-to-follow__body__user__info__text">
                                    <a href="" className="who-to-follow__body__user__info__text--name">{user?.name}</a>
                                    <a href="" className="who-to-follow__body__user__info__text--username">{user?.username}</a>
                                </div>

                                <button
                                    onClick={() => handleAddFriend(user?.id, user?.isFriendRequestSent)}
                                    className={`who-to-follow__body__user--${user?.isFriend || user?.isFriendRequestSent ? 'followed' : 'follow' || 'follow'}-button`}>
                                    {addBtnText}</button>
                            </div>

                    </div>)
                })}

            </div>

        </div>
    )
}