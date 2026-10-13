import SmallAvatar from "../_Shared/SmallAvatar";
import {getUsernameFromID} from "../../utils/Utils";
import messagesIcon from './../../svgs/messages.svg'

// Private chats are stored as "alice, bob": show the other person's name
function displayName(conversation) {
    const name = conversation?.conversation_name;
    if (!name || conversation.isGroupChat) return name;
    const ownUsername = JSON.parse(localStorage.getItem('gossip_user') ?? '{}')?.username;
    return name.split(', ').find(n => n !== ownUsername) ?? name;
}

export function ChatUserHeader({expanded, onClick,currConversation}) {

    
    return <div className={`chat-header chat-header--${expanded}`}>
        {/*<SmallAvatar src={"https://picsum.photos/50"}/>*/}
        <SmallAvatar src={messagesIcon}/>
        <div className="chat-header__names">
            <a className="chat-header__names--name">{displayName(currConversation) || `Join a conversation!`}</a>
            {/*<a href="" className="chat-header__names--username">@TheMixas</a>*/}
        </div>
        <div className="chat-header__actions">
            {currConversation.conversationID !== 0 && <div className="chat-header__actions__action chat-header__actions__action--profile"
                                               onClick={onClick}
            />}

        </div>
    </div>;
}