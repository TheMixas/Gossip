import'../../scss/feed.scss'
import './SCSS/small-avatar.scss'
import {useHref} from "react-router-dom";
export default function SmallAvatar({src, width=50, height=50, borderRad=5}) {
    console.log("src: ", src)
    return(<a className="small-avatar--avatar-link">
        <img src={src} alt="unresolved" className="small-avatar--img" height={height} width={width} style={{borderRadius:borderRad}}/>
    </a>)
}