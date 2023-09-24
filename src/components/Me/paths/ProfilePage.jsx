import Navbar from "../../navbar";
import'../profile-page.scss'
import {Link, NavLink, useNavigate, useParams} from "react-router-dom";
import RecommendedUsers from "../../_Shared/RecommendedUsers";
import SmallAvatar from "../../_Shared/SmallAvatar";
import Post from "../../_Shared/Post";
import '../../../scss/typography.scss'
import ProfilePostContainer from "../ProfilePostContainer";
import ProfileContainer from "../ProfileContainer";
import {getID, getLastPathSegment, getUsername} from "../../../utils/Utils";
import calendar from '../../../svgs/calendar.svg'
import compass from '../../../svgs/compass.svg'
import website from '../../../svgs/view-website.svg'

import '../../../scss/typography.scss'
import {useCallback, useEffect, useState} from "react";
import {cancelFriendRequest, fetchMostPopularUsers, fetchProfile, sendFriendRequest} from "../../../utils/UserCalls";
import {isAuthenticated} from "../../../utils/AuthCalls";
import NotFound from "../../404/404";
import {Coin} from "react-cssfx-loading";
export default function ProfilePage({contentType, toggleUpdatePopup,showPostPopup}) {

    const navigate = useNavigate()

    const params = useParams();
    const [user, setUser] = useState(null)
    const [mostPopularUsers, setMostPopularUsers] = useState([])
    const [requestSent, setRequestSent] = useState(false);
    const [isFriend, setIsFriend] = useState(false);

    useEffect(() => {
        setRequestSent(user?.isFriendRequestSent)
        setIsFriend(user?.isFriend)
    },[user?.isFriendRequestSent, user?.isFriend])

    const GetProfileContent = useCallback(()=>{
        fetchProfile(params.username)?.then(async res => {
            let profileJSON = await res.json()
            setUser(profileJSON)
            //Check for error
            if(profileJSON.error){
                setUser(null)
            }
            
        }).catch(err=>{
            
        })


    },[])
    const getMostPopularUsers = useCallback(async () => {
        await fetchMostPopularUsers()?.then(res => res.json()).then(
            (data) => {
                
                if(data.error) return 
                setMostPopularUsers(data.users);
            })
    })
    useEffect(()=>{
        GetProfileContent()
        getMostPopularUsers().catch()
    },[GetProfileContent])


    //If no user, show no account page
    useEffect(() => {

    },[user])

    const handleAddFriend = async (friendID) => {
        if(requestSent) {
            cancelFriendRequest(user?.id)?.then(
                (res) => {
                    if(res.status === 200){
                        alert("Friend request canceled!")
                        setRequestSent(false)

                    }else
                        alert("Something went wrong!")

                }).catch()
        }else{
            await sendFriendRequest(user?.id)?.then(
                (res) => {
                    if(res.status === 200){
                        alert("Friend request sent!")
                        setRequestSent(true)
                    }else
                        alert("Something went wrong!")

                }).catch()
        }

    }
    let addButtonText = requestSent ?  "Cancel request" : "Add friend"
    addButtonText = isFriend ? "Friends" : addButtonText

    return(
        user ?
        <div className="page__profile">
            {/*<Navbar/>*/}
            <div className="profile">
                <div className="profile__banner">
                    <img src={`data:image/png;base64,${user.banner}`}alt="" className="profile__banner--img"/>
                </div>
                <div className="profile__nav">
                    <div className="profile__nav__mini-profile">
                        <img src={`data:image/png;base64,${user.avatar}`} alt="" className="profile__nav__mini-profile--img"/>
                    </div>
                    <div className="profile__nav__links">
                        <div className="profile__nav__links__link">
                            <NavLink exact="true" to={`/${params.username}`} className="profile__nav__links__link--text navlink" end>Tweets</NavLink>
                            <NavLink to={`/${params.username}`} className="profile__nav__links__link--number navlink" end>{user.posts.length||0}</NavLink >
                        </div>
                        <div className="profile__nav__links__link">
                            <NavLink to={`/${params.username}/friends`} className="profile__nav__links__link--text navlink">Friends</NavLink>
                            <NavLink to={`/${params.username}/friends`} className="profile__nav__links__link--number navlink">{user.friends.length||0}</NavLink>
                        </div>

                        <div className="profile__nav__links__link">
                            <NavLink to={`/${params.username}/likes`} className="profile__nav__links__link--text navlink">Favourites</NavLink>
                            <NavLink to={`/${params.username}/likes`} className="profile__nav__links__link--number navlink">{user.likedPosts.length||0}</NavLink>
                        </div>
                    </div>
                    <div className="profile__nav__actions">
                        { user.id !== getID() && <button
                            onClick={() => handleAddFriend(user?.id)}
                            className={`profile__nav__actions--${requestSent || isFriend ? 'followed' : 'follow'}-btn`}>{addButtonText}</button>}
                        {/*<div className="profile__nav__actions--message"/>*/}
                        <div className="profile__nav__actions--dropdown-icon">
                            <div className="profile__nav__actions__dropdown">
                                {getUsername() === params.username ? (
                                    <div className="profile__nav__actions__dropdown__item" onClick={toggleUpdatePopup}>
                                        <div className="profile__nav__actions__dropdown__item--icon profile__nav__actions__dropdown__item--icon---block"/>
                                        <span className="profile__nav__actions__dropdown__item--text">Update Profile</span>
                                    </div>
                                ):(
                                    <>
                                    <div className="profile__nav__actions__dropdown__item">
                                        <div className="profile__nav__actions__dropdown__item--icon profile__nav__actions__dropdown__item--icon---block"/>
                                        <span

                                        onClick={() => {alert("This feature is yet to be implemented! :)")}}
                                            className="profile__nav__actions__dropdown__item--text">Block @TheMixas</span>
                                    </div>

                                    </>
                                    )}
                            </div>
                        </div>

                    </div>

                </div>
                <div className="mini-profile"></div>
                <div className="profile__body">
                    <div className="profile__body__left">
                        <div className="profile__body__left__user">
                            <img src={`data:image/png;base64,${user.avatar}`} alt="User profile avatar" className="profile__body__left__user--img"/>

                            <div className="profile__body__left__user__info">
                                <div className="profile__body__left__user__info__names profile-info-box">
                                    <span className="profile__body__left__user__info__names--name text--big--primary--bold">{user?.name }</span>
                                    <span className="profile__body__left__user__info__names--username text--medium-big--light--bold">@{user?.username}</span>
                                </div>

                                <div className="profile__body__left__user__info__additional-info">
                                    <span className="profile__body__left__user__info__additional-info--status profile-info-box text--medium--thin">{user?.status}</span>
                                    <div className="profile__body__left__user__info__additional-info--container profile-info-box">
                                        <img src={calendar} alt="" className="profile__body__left__user__info__additional-info--icon"/>
                                        <span className="profile__body__left__user__info__additional-info--joined text--medium--bold">Joined: {user?.created}</span>
                                    </div>
                                    {
                                        user?.location &&
                                        <div className="profile__body__left__user__info__additional-info--container profile-info-box">
                                            <img src={compass} alt="" className="profile__body__left__user__info__additional-info--icon"/>
                                            <span className="profile__body__left__user__info__additional-info--location text--medium--bold ">{user?.location}</span>
                                        </div>
                                    }
                                    {
                                        user?.website &&
                                        <div className="profile__body__left__user__info__additional-info--container profile-info-box">
                                            <img src={website} alt="" className="profile__body__left__user__info__additional-info--icon"/>
                                            <span className="profile__body__left__user__info__additional-info--website text--medium--bold">{user?.website}</span>
                                        </div>
                                    }


                                </div>
                                {
                                    user?.id !== getID() &&
                                    <div className="profile__body__left__user__followed-friends profile-info-box">
                                        <span className="profile__body__left__user__followed-friends--text text--medium-big--light--bold">Follows <span className={"text--big--primary--bold"}>{user?.mutuals?.length}</span> of your friends.</span>
                                    </div>
                                }
                                {user?.postImages?.length > 0 &&
                                <>
                                    <h1 className={"text--medium--big--black--medium--bold"}>Media and images</h1>
                                    <div className="profile__body__left__user__images">
                                        {user?.postImages?.map((image, index) => (
                                            <img key={index} className={"profile__body__left__user--small-image"} src={`data:image/png;base64,${image}`} alt={""}/>
                                        ))}
                                    </div>
                                </>}
                            </div>

                        </div>
                    </div>
                    <div className="profile__body__center">
                        {contentType === "post" ? <ProfilePostContainer showPopup={showPostPopup} user={user}/> : <ProfileContainer user={user}/>}
                        {/*<ProfilePostContainer/>*/}
                        {/*/!*<ProfileContainer header="Following"/>*!/*/}
                    </div>
                    <div className="profile__body__right">
                        <RecommendedUsers title="You may also like" users={mostPopularUsers}/>
                    </div>
                </div>
            </div>
        </div>
            :

            <>
                <Navbar/>
                <div className={"timeline--loading-container"}>
                    <Coin color={"#7b92e5"} height={"15rem"} width={"15rem"}/>
                </div></>

    )
}