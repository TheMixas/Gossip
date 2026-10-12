import {createContext, useState} from "react";
import {isAuthenticated} from "../../utils/AuthCalls";


export const CreatePostModalContext = createContext()
export const CreatePostModalContextProvider = ({children}) => {

    const [createPostPopup, setCreatePostPopup] = useState(false);
    const toggleCreatePostPopup = ()=>{
        setCreatePostPopup(!createPostPopup)
        
    }

    return(
        <CreatePostModalContext.Provider value={{createPostPopup,setCreatePostPopup,toggleCreatePostPopup}}>
            {children}
        </CreatePostModalContext.Provider>
    )
}