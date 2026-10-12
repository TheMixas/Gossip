import './profile-container.scss'
import SmallAvatar from "../_Shared/SmallAvatar";
import './../../scss/typography.scss'
import {getLastPathSegment} from "../../utils/Utils";
import {fetchMiniProfile, fetchNamesAndAvatar} from "../../utils/UserCalls";
import {useCallback, useEffect, useState} from "react";
import UserContainer from "../Feed/UserContainer";
export default function ProfileContainer({user}) {
    
    const [profilesContents, setProfilesContents] = useState([])

    let getProfileContent = useCallback(async (friendID) => {
        return fetchMiniProfile(friendID)
    },[])
    useEffect(()=>{
        for (let i = 0; i < user.friends.length; i++) {
                
                getProfileContent(user.friends[i].friend).then(async res => {
                    let profileJson= await res.json()
                    
                    setProfilesContents([...profilesContents,profileJson.miniProfile])
                }).catch(err=>{
                    
                })
        }
    },[getProfileContent])

    useEffect(()=>{
        
    },[profilesContents])
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