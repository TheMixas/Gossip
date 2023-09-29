// post a post
import {apiURL} from "../api";
export async function handleCreatePostForm(e,textArea,images=[],isComment=false,originalPostId=undefined,isRetweet=false,){
    //NOTE: returns a promise
    
    const formData = new FormData();

    
    for (let i = 0; i < images.length; i++) {
        formData.append(`images`, images[i]);

    }
    // images.forEach((image, index) => {
    // });
    formData.append('body', textArea);
    formData.append('isComment', isComment);
    formData.append('isRetweet', isRetweet);
    formData.append('ogPostId', originalPostId);

    //print ogPostId

    return  fetch(`${apiURL}/posts/post`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })

}
//get post comments
export async function handleGetPostComments(postId,limit=100,offset=0){

    const body = {
        postId: postId,
        limit: limit,
        offset: offset
    }

    return await fetch(`${apiURL}/posts/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then (async res => {

        if (res.status === 200) {
            
            return await res.json()
        } else {
            
            return undefined
        }
    }).catch(e => {
        
    })
}

//fetch post recent likers
export async function handleGetPostRecentLikers(postId,limit=100,offset=0){
    
    const body = {
        postId: postId,
        limit: limit,
        offset: offset
    }
    
    return await fetch(`${apiURL}/posts/recentLikers`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then (async res => {
        
        if (res.status === 200) {
            
            return await res.json()
        } else {
            
            return undefined
        }
    }).catch(e => {
        
    })
}

export async function handleGetPost(postID){


    return await fetch(`${apiURL}/posts/getPost/${postID}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })

}
