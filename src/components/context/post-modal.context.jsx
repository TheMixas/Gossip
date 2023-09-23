import {createContext, useState} from "react";
import {isAuthenticated} from "../../utils/AuthCalls";


export const PostModalContext = createContext()
export const PostModalContextProvider = ({children}) => {

    const [popUpPostComments, setPopUpPostComments] = useState([{}]);
    const [postPopup, setPopup] = useState(false);
    const [popUpPost, setPopUpPost] = useState({});
    const [retweetedPost, setRetweetedPost] = useState(undefined);
    const [popUpPostRecentLikers, setPopUpPostRecentLikers] = useState([{}]);

    const togglePostPopup = ()=>{
        setPopup(!postPopup)
    }
    return(
        <PostModalContext.Provider value={{popUpPost,postPopup,popUpPostRecentLikers,
            popUpPostComments,setRetweetedPost,setPopup,setPopUpPostRecentLikers,
            setPopUpPostComments,setPopUpPost,retweetedPost,togglePostPopup}}>
            {children}
        </PostModalContext.Provider>
    )
}