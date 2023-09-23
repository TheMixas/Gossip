import './profile-container.scss'
import SmallAvatar from "../_Shared/SmallAvatar";
import './../../scss/typography.scss'
import {getLastPathSegment} from "../../utils/Utils";
import {fetchMiniProfile, fetchNamesAndAvatar} from "../../utils/UserCalls";
import {useCallback, useEffect, useState} from "react";
import UserContainer from "../Feed/UserContainer";
export default function ProfileContainer({user}) {
    console.log("last path: ",getLastPathSegment(window.location.href))
    const [profilesContents, setProfilesContents] = useState([])

    let getProfileContent = useCallback(async (friendID) => {
        return fetchMiniProfile(friendID)
    },[])
    useEffect(()=>{
        for (let i = 0; i < user.friends.length; i++) {
                console.log("friendID: ", user.friends[i].friend)
                getProfileContent(user.friends[i].friend).then(async res => {
                    let profileJson= await res.json()
                    console.log("mini profile: ", profileJson.miniProfile)
                    setProfilesContents([...profilesContents,profileJson.miniProfile])
                }).catch(err=>{
                    console.log("error whjile loading friends mini profiles: ", err)
                })
        }
    },[getProfileContent])

    useEffect(()=>{
        console.log("profilesContents: ", profilesContents)
    },[profilesContents])
    return(
        <div className="profile-container">
            <span className="profile-container__header text--big--primary--bold">{getLastPathSegment(window.location.href)}</span>
            <div className="profile-container__body">
                {
                    profilesContents.map((friend,index)=>{
                        console.log("friend: ", friend)
                        return(
                            <UserContainer key={index} user={friend}/>
                        )
                    })
                }
            </div>
        </div>
    )
}