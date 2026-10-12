
import './App.scss';
import Navbar from "./components/navbar";
import Feed from "./components/Feed/feed";
import {HashRouter, Navigate, Router} from 'react-router-dom'
//import routes and route from react-router-dom
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./components/Me/paths/ProfilePage";
import {useCallback, useContext, useEffect, useState} from "react";
import PostModal from "./components/Popup/PostModal";
import Messages from "./components/Chat/messages";
import AuthModal from "./components/Popup/AuthModal";
import UpdateProfileModal from "./components/Popup/UpdateProfileModal";
import {isAuthenticated} from "./utils/AuthCalls";
import {handleGetPostComments, handleGetPostRecentLikers} from "./utils/PostCalls";
import { JSEncrypt } from "jsencrypt";
import {socket} from "./socket";
import NotifsPage from "./components/Notifs/notifsPage";
import {amIAuthenticated} from "./utils/UserCalls";
import {clearAccountInfo} from "./utils/Utils";
import NoAccount from "./components/404/no-account";
import NotFound from "./components/404/404";
import CreatePostModal from "./components/Popup/CreatePostModal";
import {PostModalContext} from "./components/context/post-modal.context";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import {ToastContainer} from "react-toastify";


function App() {

    //CONTEXT;
    const {postPopup,setPopup,popUpPost,setPopUpPost,popUpPostComments,
        setPopUpPostComments,popUpPostRecentLikers, setPopUpPostRecentLikers,
       retweetedPost, setRetweetedPost,togglePostPopup} = useContext(PostModalContext);

    const [authPopup, setAuthPopup] = useState(!isAuthenticated());
    const [updateUserPopup, setUpdateUserPopup] = useState(false);

    const toggleUpdateUserPopup = () => {
        setUpdateUserPopup(!updateUserPopup)
    }
    const getPostComments = useCallback(async (postId,limit=100,offset=0)=>{
        return await handleGetPostComments(postId,limit,offset)
    })
    const getPostRecentLikers = useCallback(async (postId,limit=100,offset=0)=>{
        return await handleGetPostRecentLikers(postId,limit,offset)
    })


    //2


    //On each mount check if user is authenticated
    const getAmIAuthenticated = useCallback(async ()=>{
        return await amIAuthenticated()
    },[])

    useEffect(()=>{
        getAmIAuthenticated().then(r => {
            if(r.status === 200){
                setAuthPopup(false)
                
            }else{
                setAuthPopup(true)
                
                //Clear local storage
                clearAccountInfo()
            }
        }).catch(e => console.log(e))

    },[getAmIAuthenticated])
    const setPopupPostAndToggle= async (post) => {
        setPopUpPost(post)
        getPostComments(post.id).then(r => {
            
            setPopUpPostComments(r)
        })
        getPostRecentLikers(post.id).then(r => setPopUpPostRecentLikers(r))
        togglePostPopup()
    }
    const setPopupAndOpen= async (post) => {
        setPopUpPost(post)
        getPostComments(post.id).then(r => setPopUpPostComments(r))
        getPostRecentLikers(post.id).then(r => setPopUpPostRecentLikers(r))
        setPopup(true)
    }
    useEffect(()=>{
        console.log("process.env.NODE_ENV: ", process.env.REACT_APP_REACT_ENV)
        console.log("process.env.REACT_APP_1", process.env.REACT_APP_1)
    },[])

    //TODO: DISABLE AUTO AUTH POPUP WHEN USER IS LOGGED IN

  return (
      <>
            <Routes>
            <Route path={"/"} element={<>
                <Feed
                    setAndShowPopup={setPopupAndOpen}
                />

                <CreatePostModal/>
                <AuthModal/>
                <PostModal setPopupAndOpen={setPopupAndOpen}
                />
                <UpdateProfileModal on={updateUserPopup} swapState={toggleUpdateUserPopup}/>

            </>}/>

            <Route path={"/notifications/"} element={<>

                <Navbar/>
                <NotifsPage/>
                <CreatePostModal/>
                <AuthModal/>
            </>}/>

            <Route path={"/messages/"} element={<>
                <Navbar/>
                <Messages socket={socket}/>
                <AuthModal/>
                <CreatePostModal/>
                <PostModal on={postPopup} swapState={togglePostPopup}/>
                <UpdateProfileModal on={updateUserPopup} swapState={toggleUpdateUserPopup}/>

            </>}/>
                <Route path={"/forgot-password"} element={isAuthenticated() ? <Navigate to="/" /> : <>
                    <Navbar/>
                    <AuthModal stopAuthPopup={true}/>
                    <ForgotPassword/>
                </>} />
            {/*PROFILE*/}
            <Route path={"/:username"} element={<>
                <Navbar/>
                <ProfilePage contentType={"post"}
                            toggleUpdatePopup={toggleUpdateUserPopup}
                            showPostPopup={setPopupPostAndToggle}
            />

                <AuthModal/>
                <CreatePostModal/>
                <UpdateProfileModal on={updateUserPopup} swapState={toggleUpdateUserPopup}/>
                <PostModal setPopupAndOpen={setPopupAndOpen}/>
                </>}/>
            {/*ADD EVERY SINGLE MODAL HERE*/}
            <Route path={"/:username/replies"} element={<>
                <Navbar/>
                <ProfilePage contentType={"post"}
            showPostPopup={setPopupPostAndToggle}

            />
                <CreatePostModal/>
                <PostModal setPopupAndOpen={setPopupAndOpen}/>
            </>}/>
            <Route path={"/:username/media"} element={<>
                <Navbar/>
                <ProfilePage contentType={"post"} showPostPopup={setPopupPostAndToggle}/>
                <CreatePostModal/>
                <PostModal setPopupAndOpen={setPopupAndOpen}/>
                /></>}/>
            <Route path={"/:username/likes"} element={<>
                <Navbar/>
                <ProfilePage contentType={"post"} showPostPopup={setPopupPostAndToggle}/>
                <CreatePostModal/>
                <PostModal setPopupAndOpen={setPopupAndOpen}/> </>}/>
            <Route path={"/:username/friends"} element={<>
                <Navbar/>
                <ProfilePage contentType={"user"}
                                                                       showPostPopup={setPopupPostAndToggle}/>
                <CreatePostModal/>
                <PostModal setPopupAndOpen={setPopupAndOpen}/> </>}/>

            <Route path={"/users/no-user"} element={<>
                <Navbar/>
                <CreatePostModal/>
                <NoAccount/>
                <AuthModal/>
            </>}/>
            <Route path="*" element={<>
                <Navbar/>
                <CreatePostModal/>
                <NotFound/>
                <AuthModal/>
            </>}/>
        </Routes>
          <ToastContainer
              position="top-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              style={{zIndex: 9999999999,
              fontFamily: "Poppins, sans-serif"
              }}

          />
      </>

  );
}

export default App;
