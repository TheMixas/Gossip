import SmallAvatar from "../_Shared/SmallAvatar";
import "./scss/msg.scss";

export default function TextMessage({author, message,members=[],senderID="27",senderAvatar="https://picsum.photos/50"}) {
    return(
        <div className={`message-holder message-holder--${author}`}>
                <div className="message-column">
                    <span className="sender-username">{members[senderID]?.username}</span>
                    <span className={`chat__body__messages--message chat__body__messages--message--${author}`}>{message}</span>
                </div>
        </div>
    )
}