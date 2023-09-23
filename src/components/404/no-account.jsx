import './scss/404.scss'
import Navbar from "../navbar";
import {useContext} from "react";
import {AuthModalContext} from "../context/auth-pop-up.context";
export default function NoAccount(){
    const {toggleAuthPopup} = useContext(AuthModalContext)
    return(
        <>
        <Navbar toggleAuthPopup={toggleAuthPopup}/>
        <div className="not-found">
            <div className="not-found--404">
                <div className="not-found--404--img"/>
                <h1 className="not-found--404--text">PLEASE
                    <span
                        onClick={toggleAuthPopup}
                        className={"not-found--404--text-important"}>LOGIN</span>
                    TO VIEW YOUR ACCOUNT
                </h1>

            </div>

            <span className="error-icon-credit"><a href="https://storyset.com/web">Web illustrations by Storyset</a></span>
        </div>
        </>
    )
}