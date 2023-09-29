import {useState} from "react";
import './SCSS/update-profile-modal.scss'

import defaultBanner from "./../../imgs/banner.png"
import defaultAvatar from "./../../imgs/defaultAvatar.png"
import {apiURL} from "../../api";

export default function UpdateProfileModal({on=true, swapState}) {
    if(on){
        document.body.style.overflow = "hidden"
        // document.body.classList.add("active-modal")
    }
    else
        // document.body.classList.remove("active-modal")
        document.body.style.overflow = "unset"

    const [userCredentials, setUserCredentials] = useState({})

    const handleUserCredentials = (e) => {
        setUserCredentials({...userCredentials, [e.target.name]: e.target.value})
    }
    const [userAvatarBlob, setUserAvatarBlob] = useState(null)
    const [userBannerBlob, setUserBannerBlob] = useState(null)

    const handleUserAvatar = (e) => {
        setUserAvatarBlob(e.target.files[0])
    }
    const handleUserBanner = (e) => {
        setUserBannerBlob(e.target.files[0])
    }

   return(<>
       {on &&(
              <div className="modal">
                    <div className="overlay">
                        <div className="container">
                            <div className="container__header">
                                <span onClick={swapState} className="container__header--close-btn">x</span>
                                <h1 className="container__header--title">Update your profile.</h1>
                            </div>
                            <form action={`${apiURL}/users/update`} className="container__form" method="post"  encType="multipart/form-data">
                                {/*<div className="container__form__inputs">*/}
                                    <label className="container__form__inputs__labels--banner">
                                        <div className="container__form__inputs__labels--banner--button"
                                            style={userBannerBlob === null ? {backgroundImage: `url(${defaultBanner})`} :
                                                {backgroundImage: `url(${URL.createObjectURL(userBannerBlob)})`}}
                                        />
                                        <input className="container__form__inputs__labels--banner--input"
                                               name={"banner"}
                                                  onChange={handleUserBanner}
                                               type="file"
                                        />
                                    </label>
                                    <label className="container__form__inputs__labels--avatar">
                                        <div className="container__form__inputs__labels--avatar--button"
                                             style={userAvatarBlob === null ? {backgroundImage: `url(${defaultAvatar})`}:
                                        {backgroundImage:`url(${URL.createObjectURL(userAvatarBlob)})`}}/>
                                        <input className="container__form__inputs__labels--avatar--input"
                                                  name={"avatar"}
                                                    onChange={handleUserAvatar}
                                               type="file"
                                        />
                                    </label>
                                    <input  className="container__form__inputs--input-text"
                                           type={"text"}
                                           name={"name"}
                                           placeholder={"Name"}
                                           />
                                    <input className="container__form__inputs--input-text"
                                             type={"text"}
                                           name={"status"}
                                           placeholder={"Status"}
                                             />
                                    <input className="container__form__inputs--input-text"
                                             type={"text"}
                                             name={"location"}
                                             placeholder={"Location"}
                                                />
                                    <input className="container__form__inputs--input-text"
                                            type={"text"}
                                            name={"website"}
                                             placeholder={"Website"}
                                                />
                                    <input className="container__form__inputs--input-text"
                                           type={"text"}
                                             name={"oldPassword"}
                                           placeholder={"Old Password"}
                                           required
                                    />

                                    <input className="container__form__inputs--input-text"
                                           type={"text"}
                                           name={"password"}
                                           placeholder={"New Password"}
                                    />
                                    <input className="container__form__inputs--submit-btn"
                                             type={"submit"}
                                           />
                            </form>


                        </div>
                    </div>

              </div>
       )}
   </>)
}