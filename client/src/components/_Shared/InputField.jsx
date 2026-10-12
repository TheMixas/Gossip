import {useEffect, useState} from "react";
import {handleCreatePostForm} from "../../utils/PostCalls"

import FileContainer from "./FileContainer";

import('./SCSS/input-field.scss')
export default function InputField({text="What`s up?",buttonText="Post",isMessage,
                                       handleSubmitMessage,isComment=false,isRetweet=false,originalPostID=null,
                                       inputSCSS={},containerSCSS={}, color="#36393e",border= "#282b30",
                                       onSuccess=()=>{}}) {
    //char limit
    const [currentChars, setCurrentChars] = useState(0);


    const handleCharCount = (e) => {
        setCurrentChars(e.target.value.length);
    }
    //input
    const [media, setMedia] = useState([]);
    const [mediaPreview, setMediaPreview] = useState([]);

    //text area
    const [textArea, setTextArea] = useState("");

    useEffect(() => {
        if(!media){
            setMediaPreview([]);
            return;
        }
        const previews = media.map((file) => URL.createObjectURL(file));
        setMediaPreview(previews);
    }, [media])
    const handleMediaChange = (e) => {
        setMedia([...media, e.target.files[0]]);
        
    }
    const handleMediaRemove = (preview, image) => {
        

        //remore from pewviews
        setMediaPreview(mediaPreview.filter((imgPreview) => imgPreview !== preview));
        //remove from media
        //revoke object url
        //
        setMedia(media.filter((media)=> {
            return media !== image
        }));
        URL.revokeObjectURL(preview)

    }
    //handle text area
    const handleTextArea = (e) => {
        setTextArea(e.target.value);
    }

    return(
        <div className="create-tweet__container" style={{...containerSCSS}}>
            <div className="create-tweet" style={{...inputSCSS,height:'auto'}}>
                {/*<img className="create-tweet__avatar"></img>*/}
                <span className="create-tweet__char-limit">{currentChars}/280</span>

                <form
                      encType="multipart/form-data"
                      onSubmit={async function (e) {
                          e.preventDefault();
                          if(isMessage) {
                              //if not empty
                                if(textArea.length === 0 && media.length === 0) return;
                                await handleSubmitMessage(textArea, media,mediaPreview)
                                setTextArea("")
                                setMedia([])
                                setMediaPreview([])
                                e.target.reset();
                                return;
                          }
                         handleCreatePostForm(e, textArea,media, isComment, originalPostID,isRetweet).then(async res => {
                             
                             let resJSON = await res.json()
                             
                             if (res.status === 200) {
                                 setTextArea("")
                                 setMedia([])
                                 setMediaPreview([])
                                 e.target.reset();
                                 onSuccess({
                                     original_post_id: originalPostID,
                                     body: textArea,
                                     photos: mediaPreview,
                                     isRetweet,
                                     isComment,
                                     id: resJSON.id,
                                     stats: {
                                         likes: 0,
                                         comments: 0,
                                         retweets: 0
                                     }

                                 })
                             }
                         }).catch()
                      }}
                      className="create-tweet__input-and-actions">

                    <textarea name="" id="" cols="30" rows="10" maxLength="280" onChange={(e)=> {
                        handleCharCount(e)
                        handleTextArea(e)
                    }}
                               className=" text--medium--bold create-tweet__input" placeholder={text}
                              style={ isMessage || isRetweet || isComment ? {height: '5rem'} : {height:'10rem'}}
                              value={textArea}

                    />
                    <div className="create-tweet__actions">
                        <label className="create-tweet__media-container">
                            <div className="create-tweet__media"></div>
                            <input type="file"
                                   name={"images"}
                                   onChange={handleMediaChange} style={{display: 'none'}}/>
                        </label>
                        <input type={"submit"}
                               className="create-tweet__focused--post-button"
                                 value={buttonText}
                        />
                    </div>
                </form>



                <div className="files-container">
                    {mediaPreview.length > 0 && mediaPreview.map((img,index) => <FileContainer mediaPreview={img} media={media[index]} handleMediaRemove={handleMediaRemove}/>)}
                </div>

            </div>
        </div>
    )
}