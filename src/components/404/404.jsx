import './scss/404.scss'
import Navbar from "../navbar";
import {useNavigate} from "react-router-dom";
export default function NotFound({toggleAuthPopup}){
    const navigate = useNavigate()
    return(
        <>
            <Navbar toggleAuthPopup={toggleAuthPopup}/>
            <div className="not-found">
                <div className="not-found--404">
                    <div className="not-found--404--img"/>
                    <h1 className="not-found--404--text">RETURN
                        <span
                            onClick={()=>navigate("/")}
                            className={"not-found--404--text-important"}>HOME</span>
                    </h1>

                </div>

                <span className="error-icon-credit"><a href="https://storyset.com/web">Web illustrations by Storyset</a></span>
            </div>
        </>
    )
}