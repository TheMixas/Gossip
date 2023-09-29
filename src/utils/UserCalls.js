import {isAuthenticated} from "./AuthCalls";
import {getID} from "./Utils";
import {useEffect} from "react";
import {apiURL} from "../api";
console.log("apiURL: ", apiURL)
console.log("process.env.NODE_ENV in utils js: ", process.env.REACT_APP_REACT_ENV)
console.log("process.env.REACT_APP_1 in utils js", process.env.REACT_APP_1)

export function fetchOwnAvatar(){
    if (!isAuthenticated()) return undefined;

    //call api to logout
    return fetch(`${apiURL}/users/avatar`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
export function amIAuthenticated(){
    return fetch(`${apiURL}/users/authenticated`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
export function fetchOwnBanner(){
    if (!isAuthenticated()) return undefined;

    //call api to logout
    return fetch(`${apiURL}/users/banner`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
export function fetchMiniProfile(userId){

    //call api to logout
    return fetch(`${apiURL}/${userId}/mini-profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

//NOTE: Query users and posts
export function fetchQueryUsersAndPosts(query){

    //call api to logout
    return fetch(`${apiURL}/search/${query}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })

}


// get friend request
export function fetchFriendRequests(){
    if (!isAuthenticated()) return undefined;

    //call api to logout
    return fetch(`${apiURL}/friendrequests`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
// accept
export function acceptFriendRequest(friendId){
    if (!isAuthenticated()) return undefined;

    //call api to logout
    return fetch(`${apiURL}/friendrequests/accept`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({sender_user_id:friendId})
    })
}
// reject with post
export function rejectFriendRequest(rejectectedId){
    if (!isAuthenticated()) return undefined;

    //call api to logout
    return fetch(`${apiURL}/friendrequests/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({sender_user_id:rejectectedId})
    })

}
//SEND FRIEND REQUEST
export function sendFriendRequest(friendId){

if (!isAuthenticated()) return undefined;

    //call api to logout
    return fetch(`${apiURL}/friendrequests/send`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({receiver_user_id:friendId})
    })
}
export function cancelFriendRequest(friendId){

        if (!isAuthenticated()) return undefined;

        //call api to logout
        return fetch(`${apiURL}/friendrequests/cancel`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({receiver_user_id:friendId})
        })
}

export function fetchHotPosts(){
    console.log("calling fetch hot posts from api: " + apiURL)
    return fetch(`${apiURL}/posts/hottestPosts`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
//like a post

export function likePost(postId){

    //print post id
    
   return fetch(`${apiURL}/posts/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({postId})
    })



}
//unlike a post

export function unlikePost(postId){

        //print post id
        
    return fetch(`${apiURL}/posts/unlike`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({postId})
        })
}
//fetch a post
export function fetchPost(postId){
    return fetch(`${apiURL}/posts/getPost/${postId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

//fetch users avatar
export function fetchAvatar(userId){
    
return fetch(`${apiURL}/users/${userId}/avatar`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })

}


export function fetchProfile(username){
    return fetch(`${apiURL}/users/${username}/${getID()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function fetchNamesAndAvatar(id){
    
    return fetch(`${apiURL}/${id}/namesandavatar`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

//Get user stats
export function fetchUserStats(userId){
    return fetch(`${apiURL}/${userId}/stats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function fetchMostPopularUsers(){
    return fetch(`${apiURL}/users/mostPopular`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

