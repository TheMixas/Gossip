import {useCallback, useContext, useEffect, useState} from "react";
import './SCSS/post-modal.scss'
import SmallAvatar from "../_Shared/SmallAvatar";
import InputField from "../_Shared/InputField";
import Post from "../_Shared/Post";
import ImgGallery from "../_Shared/ImgGallery";
import {handleCreatePostForm} from "../../utils/PostCalls";
import {fetchOwnAvatar, likePost, sendFriendRequest, unlikePost} from "../../utils/UserCalls";
import {getID, getName, getUsername} from "../../utils/Utils";

import './../../scss/typography.scss'
import ReactTimeAgo from "react-time-ago";
import {PostModalContext} from "../context/post-modal.context";
import {notifyError, notifySuccess} from "../../utils/toast";
export default function PostModal({setPopupAndOpen}) {


    //context:
    const {postPopup,popUpPost,popUpPostComments,popUpPostRecentLikers,togglePostPopup} = useContext(PostModalContext);

    let retweetedPostObj = popUpPost.original_post_id ?
        {
            id: popUpPost.original_post_id,
            creator_name: popUpPost.original_creator_name,
            creator_id: popUpPost.original_creator_id,
            creator_username: popUpPost.original_creator_username,
            body: popUpPost.original_body,
            photos: popUpPost.original_photos,
            created_at: popUpPost.original_created_at,
            avatar: popUpPost.original_avatar,
            isRetweet: true,
            like_count: popUpPost.original_like_count,
            isLiked: popUpPost.original_isLiked,
            retweet_count: popUpPost.original_retweet_count,
            comment_count: popUpPost.original_comment_count,

        }:
        null


    if(postPopup){
        document.body.style.overflow = "hidden"
        // document.body.classList.add("active-modal")
    }
    else
        // document.body.classList.remove("active-modal")
        document.body.style.overflow = "unset"

    const [engageType, setEngageType] = useState("comment")//comment, retweet



    const [likes, setLikes] = useState(popUpPost.like_count)
    const [isLiked, setIsLiked] = useState(false)
    const [_comments, setComments] = useState(popUpPostComments)
    useEffect(()=>{
        setComments(popUpPostComments)
    },[popUpPostComments])
    useEffect(()=>{
        setLikes(popUpPost.like_count)
    },[popUpPost])
    useEffect(()=>{
        setIsLiked(popUpPost?.user_liked)
    },[popUpPost])

    const handleLikePost = async () => {
        if(isLiked) {
            
            await unlikePost(popUpPost.id).then(
                (res) => {
                    if(res.status === 200){
                        setLikes(likes-1)
                        setIsLiked(false)
                    }else
                       notifyError("Something went wrong!")

                }).catch()
        }else{
            await likePost(popUpPost.id).then(
                (res) => {
                    if(res.status === 200){
                        setLikes(likes+1)
                        setIsLiked(true)
                    }else
                        notifyError("Something went wrong!")

                }).catch()
        }

    }

    //handle setEngageType(engageType)
    const handleEngageType = (type) => {
        setEngageType(type)
    }
    const handleAddComment =async (post,retweetedPost) => {
        await fetchOwnAvatar().then(res => res.json()).then(
            (data) => {
                if(data.error) return
                post.avatar = data.avatar;
            }).catch()
        post.creator_name = getName();
        post.creator_username = getUsername();
        post.createdDate = "Now";
        
       setComments([post, ..._comments])
    }

    const handleAddFriend = async (friendID) => {
        await sendFriendRequest(friendID).then(
            async (res) => {
                if (res.status === 200) {
                    notifySuccess("Friend request sent!")
                } else{
                    let errorJson = await res.json()
                    if (errorJson?.error === "already friends") {
                        notifyError("Already friends!")
                    } else if (errorJson ?.error === "already sent") {
                        notifyError("Friend request already sent!")
                    } else {
                        notifyError("Something went wrong!")
                    }
                }

            }).catch()

    }
    const handleRetweet =async (post,retweetedPost) => {
        notifySuccess("Successfully retweeted!")
    }

    return(
        <>
            {postPopup &&(
                <div className="modal">
                    <div  className="overlay">
                        <div className="modal__grid">
                            <div className="modal__grid__header">
                                <SmallAvatar src={`data:image/jpeg;base64,${popUpPost.avatar}`}/>
                                <div className="modal__grid__header__names">
                                    <a href={`/${popUpPost?.creator_username}`} className="no-text-dec modal__grid__header__names--name">{popUpPost.creator_name || null}</a>
                                    <span className="modal__grid__header__names--username">{popUpPost.creator_username || null}</span>
                                </div>
                                <div className="modal__grid__header--close-btn" onClick={togglePostPopup}></div>

                                {/*{*/}
                                {/* i dont like this button being here
                                {/*    popUpPost.creator_user_id !== getID() &&*/}
                                {/*    <div*/}
                                {/*        onClick={() => handleAddFriend(popUpPost.creator_user_id)}*/}
                                {/*        className="follow-btn">Add friend</div>*/}
                                {/*}*/}

                            </div>
                            <span className="modal__grid__body__text post-text">{popUpPost.body|| null}
                            </span>
                            <div className="modal__grid__body__retweeted-post">
                                {/*{retweetedPost?.id &&*/}
                                {/*    <>*/}
                                {/*        <span className="post__body__retweeted-post--text">REPOSTED:</span>*/}
                                {/*        <Post post={retweetedPost} showPopup={setPopupAndOpen}/>*/}
                                {/*    </>*/}

                                {/*}*/}
                                {
                                    popUpPost?.original_post_id &&
                                    <>
                                        <span className="post__body__retweeted-post--text">REPOSTED:</span>
                                        <Post post={retweetedPostObj} showPopup={setPopupAndOpen}/>
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
                                        <span className="modal__grid__body__navigation__interactions__interaction--count">{popUpPost?.comment_count}</span>
                                    </div>
                                    <div className="modal__grid__body__navigation__interactions__interaction">
                                        <span className="modal__grid__body__navigation__interactions__interaction--text">Retweets</span>
                                        <span className="modal__grid__body__navigation__interactions__interaction--count">{popUpPost?.retweet_count}</span>
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
                                    {/*{console.log("popuop likers; ",popUpPostRecentLikers)}*/}
                                    {popUpPostRecentLikers.map((liker,index)=>(
                                        <SmallAvatar linkTo={liker?.username} key={index} src={`data:image/jpeg;base64,${liker.avatar64}`} height={30} width={30} borderRad={3}/>
                                    ))}

                                </div>
                            </div>
                            <ReactTimeAgo  className={"modal__grid__body--post-date"} date={popUpPost?.created_at || 0} locale="en"/>
                            <div className="modal__grid__body__actions">
                                <div title={`Reply to ${popUpPost?.creator_username}`} className={engageType==="comment"? `modal__grid__body__actions__action--active` :"modal__grid__body__actions__action"}
                                     onClick={()=>handleEngageType("comment")}

                                >
                                    <div className="modal__grid__body__actions__action--icon modal__grid__body__actions__action--icon---reply"/>
                                </div>
                                <div title={`Retweet ${popUpPost?.creator_username}`} className={engageType==="retweet"? `modal__grid__body__actions__action--active` :"modal__grid__body__actions__action"}
                                    onClick={()=>handleEngageType("retweet")}
                                >
                                    <div className="modal__grid__body__actions__action--icon modal__grid__body__actions__action--icon---retweet"/>
                                </div>
                                <div title={`Like ${popUpPost?.creator_username} post`} className="modal__grid__body__actions__action">
                                    <div
                                        onClick={()=>handleLikePost()}
                                        className={`modal__grid__body__actions__action--icon modal__grid__body__actions__action--icon---${isLiked ? 'liked' : 'like'}`}/>
                                </div>
                            </div>


                            <div className="flip-engage-card">
                                <div className={engageType=== "retweet" ? "flip-engage-card--inner" : "flip-engage-card--inner flip-engage-card--inner--flip"}>
                                    <div className="flip-engage-card-front">
                                        <InputField text={`Retweet @${popUpPost.creator_username}`}
                                                    buttonText={"Retweet"}
                                                    isRetweet={true}
                                                    onSuccess={handleRetweet}
                                                    originalPostID={popUpPost.id}

                                        />

                                    </div>
                                    <div className="flip-engage-card-back">
                                        <InputField text={`Reply to @${popUpPost.creator_username}`}
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