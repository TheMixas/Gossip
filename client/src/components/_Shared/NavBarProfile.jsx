import '../../scss/user-profile.scss'
import '../../scss/navbar.scss'
import {isAuthenticated, logout} from "../../utils/AuthCalls";
import {useCallback, useContext, useEffect, useState} from "react";
import {fetchOwnAvatar, fetchOwnBanner} from "../../utils/UserCalls";
import {AuthModalContext} from "../context/auth-pop-up.context";
import defaultAvatar from '../../imgs/defaultAvatar.png'
import defaultBanner from '../../imgs/banner.png'
import {CreatePostModalContext} from "../context/create-post-modal.context";
import {useNavigate} from "react-router-dom";
import {getUsername} from "../../utils/Utils";

function NavBarProfile(){
    const navigate = useNavigate()
    //context:
    const {toggleCreatePostPopup} = useContext(CreatePostModalContext)
    const {toggleAuthPopup} = useContext(AuthModalContext)
    const [avatar, setAvatar] = useState(undefined);
    const [banner, setBanner] = useState(undefined);
    const fetchAvatar = useCallback(async () => {

        let avatarUrl;
        await fetchOwnAvatar().then(async res => {
            let data = await res.json()
            if (data?.error) return
            avatarUrl = data?.avatar;
        }).catch(err => console.log("err while trying to get avatar", err))
        //print
        setAvatar(avatarUrl);
    },[])
    const fetchBanner = useCallback(async () => {

            let bannerUrl;
            await fetchOwnBanner().then(async res => {
                let data = await res.json()
                if (data.error) return
                bannerUrl = data?.banner;
            }).catch(err => console.log("err while trying to get banner",err))
            //print
            setBanner(bannerUrl);
    },[])
    useEffect(  () => {
        fetchAvatar().catch(err => console.log("avatar fetch error: "+err))
        fetchBanner().catch(err => console.log("banner fetch error: "+err))
    },[fetchAvatar, fetchBanner])
    useEffect( () => {
        
        
    }, [avatar])
    return (
        <div className="user-profile-dropdown-container">
            <img className="user-profile__image" src={avatar !== undefined ? `data:image/jpeg;base64,${avatar}`
                : require("../../imgs/defaultAvatar.png")} alt="profile icon">
            </img>
            <div className="user-profile__dropdown">
                <div
                    style={{backgroundImage:`url(${isAuthenticated() ? `data:image/jpeg;base64,${banner}` : `${defaultBanner}`})`

                }}
                    className="user-profile__dropdown--top-bg"/>
                <img src={isAuthenticated() ? `data:image/jpeg;base64,${avatar} ` : defaultAvatar} alt="" className="user-profile__dropdown--avatar-img"/>
                {
                    isAuthenticated() ?
                        <>
                            <a onClick={toggleCreatePostPopup}>
                                Create A Post</a>
                            <a onClick={()=>{
                                if (isAuthenticated()) {
                                    window.location.href = `/${getUsername()}`;
                                } else {
                                    window.location.href = '/users/no-user';
                                }
                            }}>
                                View Profile</a>
                            <div className="user-profile__line"></div>
                            <a onClick={logout}>Log out</a>


                        </>
                        :
                        <>
                            <a onClick={toggleAuthPopup}>Login</a>
                        </>

                }
        </div>)



        </div>
    )
}
export default NavBarProfile;