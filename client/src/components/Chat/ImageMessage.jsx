import "./scss/msg.scss";
import SmallAvatar from "../_Shared/SmallAvatar";
export default function ImageMessage({author,src,members,senderID="27",senderAvatar="https://picsum.photos/50"}) {
    return(
        <div className={`message-holder message-holder--${author}`}>
            <div className="message-column">
                <span className="sender-username">{members[senderID]?.username}</span>
                <img src={`data:image/jpeg;base64,${src}`} className={`chat__body__messages--message chat__body__messages--message--${author}`} alt="unresolved_image"/>
            </div>

        </div>
    )
}