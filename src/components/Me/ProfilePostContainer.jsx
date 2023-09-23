import Post from "../_Shared/Post";
import {NavLink} from "react-router-dom";
import {getLastPathSegment} from "../../utils/Utils";

export default function ProfilePostContainer({user, showPopup}) {
    let posts = []
    switch (getLastPathSegment(window.location.href))
    {
        case "media":
            posts = user.photoPosts
            break
        case "replies":
            posts = user.retweets
            break
        case "likes":
            posts = user.likedPosts
            break
        default:
            posts = user.posts

    }
    return (
        <div>
            <div className="profile__body__center__header">
            <NavLink exact to={`/${user?.username}`} active className="profile__body__center__header--text navlink" end>Tweets</NavLink>
            <NavLink exact to={`/${user?.username}/replies`} className="profile__body__center__header--text navlink">Retweets</NavLink>
            <NavLink exact to={`/${user?.username}/media`} className="profile__body__center__header--text navlink">Media</NavLink>
            </div>
            <div className="profile__body__center__body">
                {
                    posts.map(post => {
                        
                        return <Post key={post.id} post={post} showPopup={showPopup} />
                    })
                }
            </div>
        </div>

    )
}