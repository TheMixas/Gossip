import '../../scss/feed.scss'
import Navbar from "../navbar";
import InputField from "../_Shared/InputField";
import RecommendedUsers from "../_Shared/RecommendedUsers";
import defaultAvatar from './../../imgs/defaultAvatar.png'
import defaultBanner from './../../imgs/banner.png'
import Post from "../_Shared/Post";
import {useCallback, useContext, useEffect, useState} from "react";
import {
    fetchHotPosts, fetchMostPopularUsers,
    fetchNamesAndAvatar,
    fetchOwnAvatar, fetchQueryUsersAndPosts,
    fetchUserStats
} from "../../utils/UserCalls";
import {getID, getName, getUsername} from "../../utils/Utils";
import UserContainer from "./UserContainer";
import {QueryContext} from "../context/search-users-and-posts.context";
import {Coin} from "react-cssfx-loading";
import {AuthModalContext} from "../context/auth-pop-up.context";
import {PostModalContext} from "../context/post-modal.context";
function Feed() {

    return (
        <div className="page__feed">
            <Navbar/>
            <FeedComponent/>
            {/*<div className="feed">*/}
            {/*    <div className="left-block cell">*/}
            {/*        <div className="user-info-container">*/}
            {/*            <img src={ namesAndAvatars?.banner ?*/}

            {/*                `data:image/jpeg;base64,${namesAndAvatars?.banner}`*/}
            {/*                :*/}
            {/*                defaultBanner*/}
            {/*            }*/}
            {/*                 alt="" className="user-info__banner"/>*/}
            {/*            <div className="user-info__data">*/}
            {/*                <a href="" className="user-info__avatar--link">*/}
            {/*                    <img src={ namesAndAvatars?.avatar ?*/}
            {/*                        `data:image/jpeg;base64,${namesAndAvatars?.avatar}`*/}
            {/*                        :*/}
            {/*                        defaultAvatar*/}
            {/*                    }*/}
            {/*                         alt="" className="user-info__avatar--img"/>*/}
            {/*                </a>*/}
            {/*                <a href="" className="user-info__names">*/}
            {/*                    <h1 className="user-info__names--name">{namesAndAvatars?.name || 'John Doe'}</h1>*/}
            {/*                    <h2 className="user-info__names--username">@{namesAndAvatars?.username || 'JoeyDoey123'}</h2>*/}
            {/*                </a>*/}
            {/*                <div className="user-info__stats">*/}
            {/*                    <a href="" className="user-info__stats--stat">*/}
            {/*                        <span className="user-info__stats--stat--label">Posts</span>*/}
            {/*                        <span className="user-info__stats--stat--number">{userStats?.postCount}</span>*/}
            {/*                    </a>*/}
            {/*                    <a href="" className="user-info__stats--stat">*/}
            {/*                        <span className="user-info__stats--stat--label">Friends</span>*/}
            {/*                        <span className="user-info__stats--stat--number">{userStats?.friendCount}</span>*/}
            {/*                    </a>*/}
            {/*                    <a href="" className="user-info__stats--stat">*/}
            {/*                        <span className="user-info__stats--stat--label">Likes</span>*/}
            {/*                        <span className="user-info__stats--stat--number">{userStats?.likesCount}</span>*/}
            {/*                    </a>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="trends-container">*/}
            {/*            <div className="trends">*/}
            {/*                <div className="trends__header">*/}
            {/*                    <span className="trends__header--title">Trends for you</span>*/}
            {/*                    <div className="trends__header__options">*/}
            {/*                        <a href="" className="trends__header__options--refresh">Refresh</a>*/}
            {/*                        <a href="" className="trends__header__options--view-all">View All</a>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="trends__body">*/}
            {/*                    <div className="trends__body__trend">*/}
            {/*                        <a href=".." className="trends__body__trend--title">Minecraft 2</a>*/}
            {/*                        <div className="trends__body__trend__info">*/}
            {/*                            <span*/}
            {/*                                className="trends__body__trend__info--trending-in">Trending in Games</span>*/}
            {/*                            <span className="trends__body__trend__info--number">50K posts</span>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}

            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}


            {/*    <div className="center-block cell">*/}
            {/*        <InputField border={inputBorderColor} color={inputColor} onSuccess={handleAddPost} />*/}
            {/*        <div className="timeline">*/}
            {/*            {searchedUsers.length <=0 && posts.length <= 0 &&*/}
            {/*                <div className={"timeline--loading-container"}>*/}
            {/*                    <Coin color={"#7b92e5"} height={"15rem"} width={"15rem"}/>*/}
            {/*                </div>*/}

            {/*            }*/}
            {/*            {searchedUsers.map(user =>{*/}
            {/*                return <UserContainer key={user.id}*/}
            {/*                                      user={user}*/}
            {/*                />*/}
            {/*            })}*/}
            {/*            {posts.map(post => <Post key={post.id}*/}
            {/*                                     showPopup={showPostPopup}*/}
            {/*                                     post={post}*/}
            {/*            />)}*/}

            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="right-block cell">*/}
            {/*        <RecommendedUsers title="Who to follow" users={mostPopularUsers}/>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>

    );
}
function FeedComponent(){
    //CONTEXT:
    const {toggleAuthPopup} = useContext(AuthModalContext)
    const {showPostPopup} = useContext(PostModalContext)


    const getHotPosts = useCallback(async () => {
        await fetchHotPosts().then(res => res.json()).then(
            (data) => {

                setPosts(data.hPosts);
            }).catch()
    }, [])
    const getOwnNamesAndAvatars = useCallback(async () => {
        await fetchNamesAndAvatar(getID()).then(res => res.json()).then(
            (data) => {

                if(data.error) return
                setNamesAndAvatars(data.user);
            }).catch()
    }, [])
    const getOwnStats = useCallback(async () => {
        await fetchUserStats(getID()).then(res => res.json()).then(
            (data) => {

                if(data.error) return
                setUserStats(data);
            })
    },[])
    const getMostPopularUsers = useCallback(async () => {
        await fetchMostPopularUsers().then(res => res.json()).then(
            (data) => {

                if(data.error) return
                setMostPopularUsers(data.users);
            })
    }, [])

    //NOTE: fetch everything on mount
    useEffect(() => {
        getOwnNamesAndAvatars().catch()
        getOwnStats().catch()
        getMostPopularUsers().catch()
    }, [getMostPopularUsers, getOwnNamesAndAvatars, getOwnStats])
    // useEffect(() => {
    //     getHotPosts().catch()
    // },[getHotPosts])

    //posts
    const [posts, setPosts] = useState([]);
    const [namesAndAvatars, setNamesAndAvatars] = useState({name: "", username: ""});
    const [userStats, setUserStats] = useState({postCount: 0, friendCount: 0, likesCount: 0});
    const [mostPopularUsers, setMostPopularUsers] = useState([]);

    const [searchedUsers, setSearchedUsers] = useState([]);
    const {query} = useContext(QueryContext)

    const inputBorderColor = "#1e2124"
    const inputColor = "#36393e"

    //NOTE: This is the function that is called when the user submits the form
    const handleAddPost =async (post) => {
        await fetchOwnAvatar().then(res => res.json()).then()
        post.name = getName();
        post.username = getUsername();
        post.created_at = Date.now();
        setPosts([post, ...posts])
    }
    const handleQuery = useCallback (async () => {

        if(query === '' || query === undefined) {

            setSearchedUsers([]);
            await fetchHotPosts().then(res => res.json()).then(
                (data) => {
                    console.log("Setting hot posts from handleQuery")
                    setPosts(data.hPosts);
                }).catch()
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
                    <img src={ namesAndAvatars?.banner ?

                        `data:image/jpeg;base64,${namesAndAvatars?.banner}`
                        :
                        defaultBanner
                    }
                         alt="" className="user-info__banner"/>
                    <div className="user-info__data">
                        <a href="" className="user-info__avatar--link">
                            <img src={ namesAndAvatars?.avatar ?
                                `data:image/jpeg;base64,${namesAndAvatars?.avatar}`
                                :
                                defaultAvatar
                            }
                                 alt="" className="user-info__avatar--img"/>
                        </a>
                        <a href="" className="user-info__names">
                            <h1 className="user-info__names--name">{namesAndAvatars?.name || 'John Doe'}</h1>
                            <h2 className="user-info__names--username">@{namesAndAvatars?.username || 'JoeyDoey123'}</h2>
                        </a>
                        <div className="user-info__stats">
                            <a href="" className="user-info__stats--stat">
                                <span className="user-info__stats--stat--label">Posts</span>
                                <span className="user-info__stats--stat--number">{userStats?.postCount}</span>
                            </a>
                            <a href="" className="user-info__stats--stat">
                                <span className="user-info__stats--stat--label">Friends</span>
                                <span className="user-info__stats--stat--number">{userStats?.friendCount}</span>
                            </a>
                            <a href="" className="user-info__stats--stat">
                                <span className="user-info__stats--stat--label">Likes</span>
                                <span className="user-info__stats--stat--number">{userStats?.likesCount}</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="trends-container">
                    <div className="trends">
                        <div className="trends__header">
                            <span className="trends__header--title">Trends for you</span>
                            <div className="trends__header__options">
                                <a href="" className="trends__header__options--refresh">Refresh</a>
                                <a href="" className="trends__header__options--view-all">View All</a>
                            </div>
                        </div>
                        <div className="trends__body">
                            <div className="trends__body__trend">
                                <a href=".." className="trends__body__trend--title">Minecraft 2</a>
                                <div className="trends__body__trend__info">
                                        <span
                                            className="trends__body__trend__info--trending-in">Trending in Games</span>
                                    <span className="trends__body__trend__info--number">50K posts</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
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
                                             showPopup={showPostPopup}
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