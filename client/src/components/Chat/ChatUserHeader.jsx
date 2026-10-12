import SmallAvatar from "../_Shared/SmallAvatar";
import {getUsernameFromID} from "../../utils/Utils";
import messagesIcon from './../../svgs/messages.svg'

export function ChatUserHeader({expanded, onClick,currConversation}) {

    
    return <div className={`chat-header chat-header--${expanded}`}>
        {/*<SmallAvatar src={"https://picsum.photos/50"}/>*/}
        <SmallAvatar src={messagesIcon}/>
        <div className="chat-header__names">
            <a className="chat-header__names--name">{currConversation?.conversation_name || `Join a conversation!`}</a>
            {/*<a href="" className="chat-header__names--username">@TheMixas</a>*/}
        </div>
        <div className="chat-header__actions">
            {currConversation.conversationID !== 0 && <div className="chat-header__actions__action chat-header__actions__action--profile"
                                               onClick={onClick}
            />}

        </div>
    </div>;
}