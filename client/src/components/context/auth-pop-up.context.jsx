import {createContext, useState} from "react";
import {isAuthenticated} from "../../utils/AuthCalls";


export const AuthModalContext = createContext()
export const AuthModalContextProvider = ({children}) => {

    const [authPopup, setAuthPopup] = useState(!isAuthenticated());
    const toggleAuthPopup = ()=>{
        setAuthPopup(!authPopup)
        
    }

    return(
        <AuthModalContext.Provider value={{authPopup,setAuthPopup,toggleAuthPopup}}>
            {children}
        </AuthModalContext.Provider>
    )
}