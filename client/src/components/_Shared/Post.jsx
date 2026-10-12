import ImgGallery from "./ImgGallery";
import {likePost, unlikePost} from "../../utils/UserCalls";
import {useCallback, useEffect, useState} from "react";
import '../../scss/typography.scss'
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import TimeAgo from 'javascript-time-ago'
import './../../scss/typography.scss'
import SmallAvatar from "./SmallAvatar";

export default function Post({showPopup,post}) {
    useEffect(() => {
        // console.log("post.user_liked: ",post.user_liked)
    }, [post.user_liked])

    //add !original post_is retweet
    let retweetedPostObj = post.original_post_id ?
        {
            id: post.original_post_id,
            creator_name: post.original_creator_name,
            creator_id: post.original_creator_id,
            creator_username: post.original_creator_username,
            body: post.original_body,
            photos: post.originalPhotos ?? post.original_photos,
            created_at: post.original_created_at,
            avatar: post.original_avatar,
            isRetweet: true,
            like_count: post.original_like_count,
            isLiked: post.original_isLiked,
            retweet_count: post.original_retweet_count,
            comment_count: post.original_comment_count,

        }:
        null
    
    const postClickHandler = () => {
        showPopup(post)
    }

    //FIXME: remove fetch retweet query
    const [likes, setLikes] = useState(post?.like_count ?? 0)
    const [isLiked, setIsLiked] = useState(post?.user_liked)

    return(
        <div className="post" onClick={postClickHandler}>
            {/*<a href="" className="post__avatar-link">*/}
            {/*    <img src={`data:image/jpeg;base64,${post?.avatar}`} alt="" className="post__avatar" width={48} height={48}></img>*/}
            {/*</a>*/}
            <SmallAvatar src={`data:image/jpeg;base64,${post?.avatar}`} width={50} height={50} borderRad={5} linkTo={`/${post?.creator_username}`}/>
            <div className="post__header">
                <div className="post__header__info">
                    <a href={`/${post?.creator_username}`} className="post__header__info--name post-name-text color--primary">{post.creator_name}</a>
                </div>
                {post?.created_at
                &&
                <ReactTimeAgo
                    className={'time-text'}
                    date={post.created_at} locale="en"/>
                }

            </div>

            <span className="post__body__text post-text">
                {post.body}
            </span>
            <div className="post__body__retweeted-post">
                {/*{retweetedPost &&*/}
                {/*    <>*/}
                {/*        <span className="post__body__retweeted-post--text">REPOSTED:</span>*/}
                {/*        <Post post={retweetedPost} showPopup={showPopup}/>*/}
                {/*    </>*/}

                {/*}*/}
                {
                    //Add !original post_is retweet
                    post?.original_post_id && post?.isRetweet &&
                    <>
                        <span className="post__body__retweeted-post--text">REPOSTED:</span>
                        <Post post={retweetedPostObj} showPopup={showPopup}/>

                    </>
                }
            </div>
            <div className="post__body__media">
                <ImgGallery images64={post.photos}
                />
            </div>
            <div className="post__interact">
                <div className="post__interact--reply"
                onClick={()=>{
                    console.log("reply click")
                    showPopup(post)
                }}>
                    <div className="post__interact--reply-icon"/>
                    <span className="post__interact--reply-count">{post?.comment_count}</span>
                </div>
                <div className="post__interact--retweet">
                    <div className="post__interact--retweet-icon"/>
                    <span className="post__interact--retweet-count">{post?.retweet_count}</span>
                </div>

                <div className={`post__interact--${isLiked ? "liked" : "like"}`}
                    onClick={async (event)=>{
                        event.stopPropagation();
                        if(isLiked) {
                            unlikePost(post.id).then(res=>{
                                if(res.status === 200){
                                    setLikes(likes-1)
                                    setIsLiked(false)
                                }
                            })
                        } else {
                            likePost(post.id).then(res=>{
                                if(res.status === 200){
                                    setLikes(likes+1)
                                    setIsLiked(true)
                                }
                            })
                        
                    }}}>
                    <div className={`post__interact--${isLiked ? "liked" : "like"}-icon`}/>
                    <span className="post__interact--like-count">{likes}</span>
                </div>
            </div>
        </div>
    )
}