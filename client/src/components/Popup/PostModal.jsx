import {useCallback, useContext, useEffect, useState} from "react";
import './SCSS/post-modal.scss'
import SmallAvatar from "../_Shared/SmallAvatar";
import InputField from "../_Shared/InputField";
import Post from "../_Shared/Post";
import ImgGallery from "../_Shared/ImgGallery";
import {handleCreatePostForm} from "../../utils/PostCalls";
import {fetchOwnAvatar, fetchPost, likePost, sendFriendRequest, unlikePost} from "../../utils/UserCalls";
import {getID, getName, getUsername} from "../../utils/Utils";

import './../../scss/typography.scss'
import ReactTimeAgo from "react-time-ago";
import {PostModalContext} from "../context/post-modal.context";
export default function PostModal({setPopupAndOpen}) {


    //context:
    const {postPopup,setPopup,popUpPost,setPopUpPost,popUpPostComments,
        setPopUpPostComments,popUpPostRecentLikers, setPopUpPostRecentLikers,
        updateUserPopup, setUpdateUserPopup,retweetedPost, setRetweetedPost,togglePostPopup} = useContext(PostModalContext);
    
    
    if(postPopup){
        document.body.style.overflow = "hidden"
        // document.body.classList.add("active-modal")
    }
    else
        // document.body.classList.remove("active-modal")
        document.body.style.overflow = "unset"

    const [engageType, setEngageType] = useState("comment")//comment, retweet



    const [likes, setLikes] = useState(popUpPost.stats?.likes)
    const [isLiked, setIsLiked] = useState(false)
    const [_comments, setComments] = useState(popUpPostComments)
    useEffect(()=>{
        setComments(popUpPostComments)
    },[popUpPostComments])
    useEffect(()=>{
        setLikes(popUpPost.stats?.likes)
    },[popUpPost])
    useEffect(()=>{
        setIsLiked(popUpPost?.isLiked)
    },[popUpPost])

    const handleLikePost = async () => {
        if(isLiked) {
            
            await unlikePost(popUpPost.id).then(
                (res) => {
                    if(res.status === 200){
                        setLikes(likes-1)
                        setIsLiked(false)
                    }else
                        alert("Something went wrong!")

                }).catch()
        }else{
            await likePost(popUpPost.id).then(
                (res) => {
                    if(res.status === 200){
                        setLikes(likes+1)
                        setIsLiked(true)
                    }else
                        alert("Something went wrong!")

                }).catch()
        }

    }

    //handle setEngageType(engageType)
    const handleEngageType = (type) => {
        setEngageType(type)
    }
    const handleAddComment =async (post,retweetedPost) => {
        await fetchOwnAvatar().then(res => res.json()).then()
        post.name = getName();
        post.username = getUsername();
        post.createdDate = "Now";
        
       setComments([post, ..._comments])
    }

    const handleAddFriend = async (friendID) => {
        await sendFriendRequest(friendID).then(
            async (res) => {
                if (res.status === 200) {
                    alert("Friend request sent!")
                } else{
                    let errorJson = await res.json()
                    if (errorJson?.error === "already friends") {
                        alert("Already friends!")
                    } else if (errorJson ?.error === "already sent") {
                        alert("Friend request already sent!")
                    } else {
                        alert("Something went wrong!")
                    }
                }

            }).catch()

    }
    const handleRetweet =async (post,retweetedPost) => {
        alert("Successfully retweeted!")
    }

    return(
        <>
            {postPopup &&(
                <div className="modal">
                    <div  className="overlay">
                        <div className="modal__grid">
                            <div className="modal__grid__header">
                                <span className="modal__grid__header--close-btn" onClick={togglePostPopup}>x</span>
                                <SmallAvatar src={`data:image/jpeg;base64,${popUpPost.avatar}`}/>
                                <div className="modal__grid__header__names">
                                    <h3 className="modal__grid__header__names--name">{popUpPost.name || null}</h3>
                                    <h4 className="modal__grid__header__names--username">{popUpPost.username || null}</h4>
                                </div>
                                {
                                    popUpPost.creator_user_id !== getID() &&
                                    <div
                                        onClick={() => handleAddFriend(popUpPost.creator_user_id)}
                                        className="follow-btn">Add friend</div>
                                }

                            </div>
                            <span className="modal__grid__body__text post-text">{popUpPost.body|| null}
                            </span>
                            <div className="modal__grid__body__retweeted-post">
                                {retweetedPost?.id &&
                                    <>
                                        <span className="post__body__retweeted-post--text">REPOSTED:</span>
                                        <Post post={retweetedPost} showPopup={setPopupAndOpen}/>
                                    </>

                                }
                            </div>
                            <div className="post__body__media">
                                <ImgGallery images64={popUpPost.photos}/>
                            </div>
                            <div className="modal__grid__body__navigation">
                                <div className="modal__grid__body__navigation__interactions">
                                    <div className="modal__grid__body__navigation__interactions__interaction">
                                        <span className="modal__grid__body__navigation__interactions__interaction--text">Replies</span>
                                        <span className="modal__grid__body__navigation__interactions__interaction--count">{popUpPost.stats && popUpPost.stats.comments}</span>
                                    </div>
                                    <div className="modal__grid__body__navigation__interactions__interaction">
                                        <span className="modal__grid__body__navigation__interactions__interaction--text">Retweets</span>
                                        <span className="modal__grid__body__navigation__interactions__interaction--count">{popUpPost.stats && popUpPost.stats.retweets}</span>
                                    </div>
                                    <div className="modal__grid__body__navigation__interactions__interaction">
                                        <span className="modal__grid__body__navigation__interactions__interaction--text">Likes</span>
                                        <span className="modal__grid__body__navigation__interactions__interaction--count">{likes}</span>
                                    </div>
                                </div>
                                <div className="modal__grid__body__navigation__recent-likes">
                                    {/*<SmallAvatar src={"https://picsum.photos/30"} height={30} width={30} borderRad={3}/>*/}
                                    {/*<SmallAvatar src={"https://picsum.photos/30"} height={30} width={30} borderRad={3}/>*/}
                                    {/*<SmallAvatar src={"https://picsum.photos/30"} height={30} width={30} borderRad={3}/>*/}
                                    {/*<SmallAvatar src={"https://picsum.photos/30"} height={30} width={30} borderRad={3}/>*/}
                                    {/*<SmallAvatar src={"https://picsum.photos/30"} height={30} width={30} borderRad={3}/>*/}
                                    {/*<SmallAvatar src={"https://picsum.photos/30"} height={30} width={30} borderRad={3}/>*/}
                                    {popUpPostRecentLikers.map((liker,index)=>(
                                        <SmallAvatar key={index} src={`data:image/jpeg;base64,${liker.avatar64}`} height={30} width={30} borderRad={3}/>
                                    ))}

                                </div>
                            </div>
                            <ReactTimeAgo  className={"modal__grid__body--post-date"} date={popUpPost?.created_at || 0} locale="en"/>
                            <div className="modal__grid__body__actions">
                                <div className="modal__grid__body__actions__action"
                                     onClick={()=>handleEngageType("comment")}

                                >
                                    <div className="modal__grid__body__actions__action--icon modal__grid__body__actions__action--icon---reply"/>
                                </div>
                                <div className="modal__grid__body__actions__action"
                                    onClick={()=>handleEngageType("retweet")}
                                >
                                    <div className="modal__grid__body__actions__action--icon modal__grid__body__actions__action--icon---retweet"/>
                                </div>
                                <div className="modal__grid__body__actions__action">
                                    <div
                                        onClick={()=>handleLikePost()}
                                        className={`modal__grid__body__actions__action--icon modal__grid__body__actions__action--icon---${isLiked ? 'liked' : 'like'}`}/>
                                </div>
                            </div>


                            <div className="flip-engage-card">
                                <div className={engageType=== "retweet" ? "flip-engage-card--inner" : "flip-engage-card--inner flip-engage-card--inner--flip"}>
                                    <div className="flip-engage-card-front">
                                        <InputField text={`Retweet @${popUpPost.username}`}
                                                    buttonText={"Retweet"}
                                                    isRetweet={true}
                                                    onSuccess={handleRetweet}
                                                    originalPostID={popUpPost.id}

                                        />

                                    </div>
                                    <div className="flip-engage-card-back">
                                        <InputField text={`Reply to @${popUpPost.username}`}
                                                    buttonText={"Reply"}
                                                    isComment={true}
                                                    onSuccess={handleAddComment}
                                                    originalPostID={popUpPost.id}

                                        />
                                    </div>
                                </div>
                            </div>



                            <div className="comments">
                                {_comments?.map((comment,index)=>(
                                    <Post key={index} post={comment}
                                          showPopup={setPopupAndOpen}

                                    />
                                ))}
                                {/*<Post/>*/}
                                {/*<Post/>*/}
                            </div>

                        </div>
                    </div>
                </div>)
                }
        </>
    )
}