import '../../scss/feed.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../navbar";
import InputField from "../_Shared/InputField";
import RecommendedUsers from "../_Shared/RecommendedUsers";
import defaultAvatar from './../../imgs/defaultAvatar.png'
import defaultBanner from './../../imgs/banner.png'
import Post from "../_Shared/Post";
import {useCallback, useContext, useEffect, useState} from "react";
import {
    fetchHotPosts, fetchMostPopularUsers,
    fetchOwnAvatar, fetchOwnMiniProfile, fetchQueryUsersAndPosts,
} from "../../utils/UserCalls";
import {getID, getName, getUsername} from "../../utils/Utils";
import UserContainer from "./UserContainer";
import {QueryContext} from "../context/search-users-and-posts.context";
import {Coin} from "react-cssfx-loading";
import {isAuthenticated} from "../../utils/AuthCalls";
import {AuthModalContext} from "../context/auth-pop-up.context";
function Feed({setAndShowPopup}) {

    return (
        <div className="page__feed">
            <Navbar/>
            <FeedComponent setAndShowPopup={setAndShowPopup}/>
        </div>

    );
}
function FeedComponent({setAndShowPopup}){
    const getOwnMiniProfile = useCallback(async () => {
        return fetchOwnMiniProfile()
    }, [])
    //TODO: optimize this query
    const getMostPopularUsers = useCallback(async () => {
        await fetchMostPopularUsers().then(res => res.json()).then(
            (data) => {

                if(data.error) return
                setMostPopularUsers(data.users);
            })
    }, [])

    //NOTE: fetch/query everything on mount
    useEffect(() => {
        getOwnMiniProfile().then(async res => {
            let profileJson = await res.json()
            if(profileJson.error) {
                console.log("Error while setting mini profile from useEffect: ",profileJson.error)
                return
            }
            console.log("Setting mini profile from useEffect to: ",profileJson.miniProfile)
            setMiniProfile(profileJson.miniProfile)
        }).catch(e=>console.log("Error while setting mini profile from useEffect: ",e))
        getMostPopularUsers().catch()
    }, [getMostPopularUsers, getOwnMiniProfile])

    //posts
    const [posts, setPosts] = useState([]);
    const [miniProfile, setMiniProfile] = useState({name: "", username: "", avatar: defaultAvatar, banner: defaultBanner});
    const [mostPopularUsers, setMostPopularUsers] = useState([]);

    const [searchedUsers, setSearchedUsers] = useState([]);
    const {query} = useContext(QueryContext)
    const {toggleAuthPopup} = useContext(AuthModalContext)


    const inputBorderColor = "#1e2124"
    const inputColor = "#36393e"

    //NOTE: This is the function that is called when the user submits the form
    const handleAddPost =async (post) => {
        console.log("Adding post: ",post)
        await fetchOwnAvatar().then(res => res.json()).then(
            (data) => {
                console.log("Setting avatar from handleAddPost 1")
                if(data.error) return
                post.avatar = data.avatar;
                console.log("Setting avatar from handleAddPost 2")
            }
        )
        post.creator_name = getName();
        post.creator_username = getUsername();
        post.created_at = Date.now();

        setPosts([post, ...posts])
    }
    const handleQuery = useCallback (async () => {

        if(query === '' || query === undefined) {

            setSearchedUsers([]);
            await fetchHotPosts().then(res => res.json()).then(
                (data) => {
                    setPosts(data.hPosts);
                }).catch(e => console.log("Errow while: Setting hot posts from handleQuery: ", e))
            return;

        }
        await fetchQueryUsersAndPosts(query).then(res => res.json()).then(
            (data) => {

                if(data.error) return
                setSearchedUsers(data.queriedUsers);
                setPosts(data.queriedPosts);
            }
        )

    },[query])
    useEffect(() => {

        handleQuery().catch()
    }, [query,handleQuery])
    return (
        <div className="feed">
            <div className="left-block cell">

                <div className="user-info-container">
                    {
                        !isAuthenticated() &&
                        <div onClick={()=> {
                            toggleAuthPopup()
                        }} className={"user-info-container--no-auth"}>
                            <span>Click to authenticate!</span>
                        </div>
                    }
                    <img src={ miniProfile?.banner ?

                        `data:image/jpeg;base64,${miniProfile?.banner}`
                        :
                        defaultBanner
                    }
                         alt="" className="user-info__banner"/>
                    <div className="user-info__data">
                        <a href={`/${miniProfile?.username}`} className="user-info__avatar--link">
                            <img src={ miniProfile?.avatar ?
                                `data:image/jpeg;base64,${miniProfile?.avatar}`
                                :
                                defaultAvatar
                            }
                                 alt="" className="user-info__avatar--img"/>
                        </a>
                        <a href="" className="user-info__names">
                            <a href={`/${miniProfile?.username}`} className="mb-2 no-text-dec user-info__names--name text--medium--primary--bold">{miniProfile?.name || 'John Doe'}</a>
                            <a href={`/${miniProfile?.username}`} className="no-text-dec user-info__names--username">@{miniProfile?.username || 'JoeyDoey123'}</a>
                        </a>
                        <div className="user-info__stats">
                            <a href={`/${miniProfile?.username}`} className="user-info__stats--stat">
                                <span className="user-info__stats--stat--label color--primary bold">Posts</span>
                                <span className="user-info__stats--stat--number color--light-1">{miniProfile?.postCount}</span>
                            </a>
                            <a href={`/${miniProfile?.username}/friends`} className="user-info__stats--stat">
                                <span className="user-info__stats--stat--label color--primary bold">Friends</span>
                                <span className="user-info__stats--stat--number color--light-1">{miniProfile?.friendCount}</span>
                            </a>
                            <a href="" className="user-info__stats--stat">
                                <span className="user-info__stats--stat--label color--primary bold">Likes</span>
                                <span className="user-info__stats--stat--number color--light-1">{miniProfile?.likesCount}</span>
                            </a>
                        </div>
                    </div>
                </div>
                {/*<div className="trends-container">*/}
                {/*    <div className="trends-container__tba-wrapper">*/}

                {/*    </div>*/}
                {/*    <div className="trends">*/}
                {/*        <div className="trends__header">*/}
                {/*            <span className="trends__header--title color--primary">Trends for you</span>*/}
                {/*            <div className="trends__header__options">*/}
                {/*                <a href="" className="trends__header__options--refresh">Refresh</a>*/}
                {/*                <a href="" className="trends__header__options--view-all">View All</a>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div className="trends__body">*/}
                {/*            <div className="trends__body__trend">*/}
                {/*                <a href=".." className="trends__body__trend--title color--primary">Minecraft 2</a>*/}
                {/*                <div className="trends__body__trend__info">*/}
                {/*                        <span*/}
                {/*                            className="trends__body__trend__info--trending-in">Trending in Games</span>*/}
                {/*                    <span className="trends__body__trend__info--number">50K posts</span>*/}
                {/*                </div>*/}
                {/*            </div>*/}

                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>


            <div className="center-block cell">
                <InputField border={inputBorderColor} color={inputColor} onSuccess={handleAddPost} />
                <div className="timeline">
                    {searchedUsers.length <=0 && posts?.length <= 0 &&
                        <div className={"timeline--loading-container"}>
                            <Coin color={"#7b92e5"} height={"15rem"} width={"15rem"}/>
                        </div>

                    }
                    {searchedUsers?.map(user =>{
                        return <UserContainer key={user.id}
                                              user={user}
                        />
                    })}
                    {posts?.map(post => <Post key={post.id}
                                             showPopup={()=>{setAndShowPopup(post)}}
                                             post={post}
                    />)}

                </div>
            </div>
            <div className="right-block cell">
                <RecommendedUsers title="Who to follow" users={mostPopularUsers}/>
            </div>
        </div>
    )
}

export default Feed;