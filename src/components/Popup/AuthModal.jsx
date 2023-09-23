import {useContext, useEffect, useState} from "react";
import'./SCSS/auth-modal.scss'
import {login, register} from "../../utils/AuthCalls";
import {AuthModalContext} from "../context/auth-pop-up.context";
export default function AuthModal () {


    //CONTEXT:
    const {toggleAuthPopup, authPopup} = useContext(AuthModalContext)

    if(authPopup){
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
    useEffect(()=>{
        
    }, [userCredentials])

    const [isLogin, setIsLogin] = useState(false) // true = login, false = register
    return(
        <>
        {authPopup &&(
            <div className="modal">
                <div className="overlay">
                    {isLogin? (<div className="login-container">
                        <div className="login-container--banner"/>
                        <div className="login-container__form">
                            <div className="login-container__form--header">
                                <span onClick={toggleAuthPopup} className="register-container__form--header--close-btn">x</span>

                                <h1 className="login-container__form--header--title">Login into Gossip.</h1>
                                <h2 className="login-container__form--header--subtitle">Login now to see your own personalized timeline!</h2>
                            </div>
                            <form action={""} className="login-container__form--form">
                                <div className="login-container__form__inputs">
                                    <input className="login-container__form__inputs--input"
                                           onChange={handleUserCredentials}
                                           type="text"
                                           placeholder="Username or email...." name={"credentials"}
                                           required/>
                                    <input className="login-container__form__inputs--input"
                                             onChange={handleUserCredentials}
                                           type="text"
                                           placeholder="Password" name={"password"}
                                           required/>
                                    <button className="login-container__form--submit-btn"
                                           type="submit" value={"Register"}
                                             onClick={(e)=>{
                                                e.preventDefault()
                                                login(userCredentials, toggleAuthPopup)
                                                 setUserCredentials({})
                                            }}
                                    >Login</button>
                                </div>

                            </form>
                            <div className="login-container__form--footer">
                                <span className="login-container__form--footer--text">Don`t have an account?</span>
                                <span onClick={()=>setIsLogin(!isLogin)} className="login-container__form--footer--link">Log in</span>

                            </div>
                        </div>
                    </div>) :<div className="register-container">
                        <div className="register-container--banner"/>
                        <div className="register-container__form">
                            <div className="register-container__form--header">
                                <span onClick={toggleAuthPopup} className="register-container__form--header--close-btn">x</span>

                                <h1 className="register-container__form--header--title">Join Gossip today.</h1>
                                <h2 className="register-container__form--header--subtitle">Sign up now to get your own personalized timeline!</h2>
                            </div>
                            <form action="" className="register-container__form--form">
                                <div className="register-container__form__inputs">
                                    <input className="register-container__form__inputs--input"
                                           onChange={handleUserCredentials}
                                           type="text"
                                           name="name" placeholder="Name"
                                           required/>
                                    <input className="register-container__form__inputs--input"
                                           onChange={handleUserCredentials}
                                           type="text"
                                           name="username" placeholder="Username"
                                           required/>
                                    <input className="register-container__form__inputs--input"
                                           onChange={handleUserCredentials}
                                           type="text"
                                           name="password" placeholder="Password"
                                           required/>
                                    <input className="register-container__form__inputs--input"
                                           onChange={handleUserCredentials}
                                           type="text"
                                           name="email" placeholder="Email"
                                           required/>
                                    <button className="login-container__form--submit-btn"
                                            type="submit" value={"Register"}
                                            onClick={(e)=>{
                                                e.preventDefault()
                                                register(userCredentials, toggleAuthPopup)
                                                setUserCredentials({})
                                            }}
                                    >Register</button>
                                </div>

                            </form>
                            <div className="register-container__form--footer">
                                <span className="register-container__form--footer--text">Already have an account?</span>
                                <span onClick={()=>setIsLogin(!isLogin)} className="register-container__form--footer--link">Log in</span>

                            </div>
                        </div>
                    </div> }

                </div>

            </div>

        )}
        </>
    )
}