import {getID} from "../../utils/Utils";
import './scss/chat-user-info.scss'
import {DetailedInfoCard} from "./DetailedInfoCard";

export function UserInfoList({showDetails,members={},toggleDetails}) {
    return(
        <>{
        showDetails === '' &&
                <div className="members">
                    <span
                        onClick={()=>{
                            
                            toggleDetails()
                        }}
                        className="close-button">✖</span>
                    {Object.keys(members)?.map(member => {
                        if(member != getID()){
                            return <DetailedInfoCard showDetails={showDetails} member={members[member]} key={member}/>
                        }
                    })
                    }
                </div>
        }
        </>
    )

}