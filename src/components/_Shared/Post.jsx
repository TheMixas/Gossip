import ImgGallery from "./ImgGallery";
import {fetchPost, likePost, unlikePost} from "../../utils/UserCalls";
import {useCallback, useEffect, useState} from "react";
import '../../scss/typography.scss'
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import TimeAgo from 'javascript-time-ago'
import './../../scss/typography.scss'

export default function Post({showPopup,post}) {
    //NOTE: SETUP TIME AGO
    //NOTE: USED FOR POSTED_AT TIME
    TimeAgo.addDefaultLocale(en)


    
    const dblClickHandler = (event) => {
        if(event.detail === 2){
            
            showPopup(post)
        }
    }

    //NOTE: fetch retweeted post on mount
    const getRetweetedPost = useCallback(async () => {
        const res = await fetchPost(post.original_post_id)

        let resJson = await res.json()

        
        return resJson
    }, [post.original_post_id])
    useEffect(()=>{
        if(post.original_post_id && post.isRetweet){
            getRetweetedPost().then(res=>{
                setRetweetedPost(res)
            })
        }
    },[getRetweetedPost])

    const [retweetedPost, setRetweetedPost] = useState(null)
    const [likes, setLikes] = useState(post.stats?.likes)
    const [isLiked, setIsLiked] = useState(post?.isLiked)

    return(
        <div className="post" onClick={dblClickHandler}>
            <a href="" className="post__avatar-link">
                <img src={`data:image/jpeg;base64,${post?.avatar}`} alt="" className="post__avatar" width={48} height={48}></img>
            </a>
            <div className="post__header">
                <div className="post__header__info">
                    <a href="" className="post__header__info--name post-name-text">{post.name}</a>
                </div>
                <ReactTimeAgo date={post?.created_at || 0} locale="en"/>

            </div>

            <span className="post__body__text post-text">
                {post.body}
            </span>
            <div className="post__body__retweeted-post">
                {retweetedPost &&
                    <>
                        <span className="post__body__retweeted-post--text">REPOSTED:</span>
                        <Post post={retweetedPost} showPopup={showPopup}/>
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
                    showPopup(post)
                }}>
                    <div className="post__interact--reply-icon"/>
                    <span className="post__interact--reply-count">{post.stats && post.stats.comments}</span>
                </div>
                <div className="post__interact--retweet">
                    <div className="post__interact--retweet-icon"/>
                    <span className="post__interact--retweet-count">{post.stats && post.stats.retweets}</span>
                </div>

                <div className={`post__interact--${isLiked ? "liked" : "like"}`}
                    onClick={async ()=>{
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