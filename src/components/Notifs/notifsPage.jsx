import Navbar from "../navbar";
import './scss/notifs-page.scss'
import SmallAvatar from "../_Shared/SmallAvatar";
import {useCallback, useEffect, useState} from "react";
import {acceptFriendRequest, fetchFriendRequests, rejectFriendRequest} from "../../utils/UserCalls";
export default function NotifsPage({toggleAuthPopup, user={name:"Pablo"}}) {
    const [displayFriendRequests, setDisplayFriendRequests] = useState(true)

    const handleFriendRequestClick = ()=>{
        setDisplayFriendRequests(!displayFriendRequests)
    }


    const [friendRequests, setFriendRequests] = useState([])


    const getFriendRequests = useCallback(()=>{
        fetchFriendRequests()?.then((res)=>res.json()).then((res)=>{
            console.log("JSON friend requests: ", res)
            setFriendRequests(res)
        })
    },[])

    useEffect(()=>{
        getFriendRequests()
    },[])


    const handleAcceptFriendRequest = (userID,id)=>{
        console.log("accept friend request id: ", userID)
        acceptFriendRequest(userID).then((res)=>{
            console.log("accept friend request res: ", res)
            if(res.status===200 || res.status === 400){
                setFriendRequests(friendRequests.filter((friendRequest)=>friendRequest.id!==id))
            }
        })
    }
    const handleRejectFriendRequest = (rejectedId)=>{
        rejectFriendRequest(rejectedId).then((res)=>{
            console.log("reject friend request res: ", res)
            if(res.status===200 || res.status === 400){
                setFriendRequests(friendRequests.filter((friendRequest)=>friendRequest.sender_user_id!==rejectedId))
            }
        })

    }

    return(
        <div>
            <Navbar toggleAuthPopup={toggleAuthPopup}/>
            <div className="page__notifs">
                <div className="page__notifs__friend-request">
                    <div className="page__notifs__friend-request--header" onClick={handleFriendRequestClick}>
                        <h1 className="page__notifs__friend-request--header--text">Friend Requests</h1>
                    </div>
                    {
                        displayFriendRequests && friendRequests.map((friendRequest, index)=> {
                            console.log("friend request: ", friendRequest)
                                return (
                                    <div
                                        // style={{display: displayFriendRequests ? "flex" : "none"}}
                                        className="page__notifs__friend-request--request-container">
                                        <div className="page__notifs__friend-request--request-container--request">
                                            <SmallAvatar src={`data:image/jpeg;base64,${friendRequest?.avatar}`}/>
                                            <a href={`/${friendRequest?.username}`} className="page__notifs__friend-request--request-container--request--name">{friendRequest?.name}</a>
                                            <div className="page__notifs__friend-request--request-container--request--actions">
                                                <div className="page__notifs__friend-request--request-container--request--actions--accept"
                                                    onClick={()=>handleAcceptFriendRequest(friendRequest?.sender_user_id)}
                                                />
                                                <div
                                                    onClick={()=>handleRejectFriendRequest(friendRequest?.sender_user_id)}
                                                    className="page__notifs__friend-request--request-container--request--actions--reject"/>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        )
                    }



                </div>
            </div>
        </div>
    )
}