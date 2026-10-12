export function DetailedInfoCard({showDetails="",member={}}){
    return <div className={`details details--${showDetails}`}>
        <div className="details__header">
            <img src={`data:image/jpeg;base64,${member?.banner}`} alt="" className="details__header--banner"/>
            <div className="details__header__actions">
                <div className="details__header__actions__action--copy"/>
            </div>
            <img src={`data:image/jpeg;base64,${member?.avatar}`} alt="" className="details__header--avatar"/>
        </div>
        <div className="details__info">
            <div className="details__info__names">
                <span className="details__info__names--name">{member?.name}</span>
                <span className="details__info__names--username">{"@"+member?.username}</span>
            </div>
            <span className="details__info--bio">{member?.status}</span>
            {member?.location && <span className="details__info--location">{member?.location}</span>}
            {member?.website && <span className="details__info--website">{member?.website}</span>}
            <div className="details__info__stats">
                <div className="details__info__stats__stat details__info__stats__stat--followers">
                    <span className="details__info__stats__stat--followers--text">Friends</span>
                    <span className="details__info__stats__stat--followers--number">{member?.friendsCount || 0}</span>
                </div>
                {/*<div className="details__info__stats__stat details__info__stats__stat--followers">*/}
                {/*    <span className="details__info__stats__stat--followers--text">Mutual friends</span>*/}
                {/*    <span className="details__info__stats__stat--followers--number">{member?.mutualFriendsCount || 50}</span>*/}
                {/*</div>*/}
            </div>


        </div>


    </div>;
}