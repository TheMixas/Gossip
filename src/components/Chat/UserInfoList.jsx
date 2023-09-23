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
                            console.log("clicking")
                            toggleDetails()
                        }}
                        className="close-button">✖</span>
                    {Object.keys(members)?.map(member => {
                        console.log("member: ",member);
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