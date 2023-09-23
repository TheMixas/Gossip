export default function FileContainer({mediaPreview,media, handleMediaRemove}){
    console.log("img",mediaPreview)
    return(
        <div className="files-container__file-container">
            <img src={mediaPreview} alt="NOT WKIRNG" className="files-container__file-container--img"/>
            <div className="files-container__file-container--remove" onClick={()=>{handleMediaRemove(mediaPreview,media)}}/>
        </div>
    )
}