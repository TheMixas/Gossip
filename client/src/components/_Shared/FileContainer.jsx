export default function FileContainer({mediaPreview,media, handleMediaRemove}){
    
    return(
        <div className="files-container__file-container">
            <img src={mediaPreview} alt="Post image display error" className="files-container__file-container--img"/>
            <div className="files-container__file-container--remove" onClick={()=>{handleMediaRemove(mediaPreview,media)}}/>
        </div>
    )
}