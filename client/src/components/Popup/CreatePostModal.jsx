import InputField from "../_Shared/InputField";
import {CreatePostModalContext} from "../context/create-post-modal.context";
import {useContext} from "react";
import './SCSS/create-post-modal.scss'
import {toast} from "react-toastify";
import {notifySuccess} from "../../utils/toast";

export default function CreatePostModal() {

    const {createPostPopup, toggleCreatePostPopup} = useContext(CreatePostModalContext)

    return(
        <>
            {createPostPopup &&(
        <div className="modal">
            <div className="overlay">
                <div className="create-post-container">
                    <div className="create-post-container--banner"/>
                    <div className="create-post-container__right-side">
                        <div className="create-post-container__header">
                            <h1 className="create-post-container__header--title">Compose a new post</h1>
                            <span
                                onClick={toggleCreatePostPopup}
                                className="create-post-container__header--close-btn">x</span>
                        </div>
                        <div className="create-post-container__right-side__input-container">
                            <InputField
                                onSuccess={()=>notifySuccess("Post created successfully!")}
                                buttonText={"Post"} placeholder={"What's on your mind?"} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
            )}
    </>)

}