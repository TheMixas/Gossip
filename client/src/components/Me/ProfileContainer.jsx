import './profile-container.scss'
import SmallAvatar from "../_Shared/SmallAvatar";
import './../../scss/typography.scss'
import {getLastPathSegment} from "../../utils/Utils";
import {fetchMiniProfile, fetchNamesAndAvatar} from "../../utils/UserCalls";
import {useCallback, useEffect, useState} from "react";
import UserContainer from "../Feed/UserContainer";
export default function ProfileContainer({user}) {
    
    const [profilesContents, setProfilesContents] = useState(user.friends)

    useEffect(()=>{
    //used to loop trhu friends and get their info
        console.log("user.friends: ",user.friends)
    },[user.friends])

    return(
        <div className="profile-container">
            <span className="profile-container__header text--big--primary--bold">{getLastPathSegment(window.location.href)}</span>
            <div className="profile-container__body">
                {
                    profilesContents.map((friend,index)=>{
                        
                        return(
                            <UserContainer key={index} user={friend}/>
                        )
                    })
                }
            </div>
        </div>
    )
}