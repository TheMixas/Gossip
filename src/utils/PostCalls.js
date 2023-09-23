// post a post
export async function handleCreatePostForm(e,textArea,images=[],isComment=false,originalPostId=undefined,isRetweet=false,){
    //NOTE: returns a promise
    console.log("trying to create post")
    const formData = new FormData();

    console.log("images: ",images)
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
    console.log("ogPostId: ", originalPostId)

    return  fetch(`http://localhost:8080/posts/post`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })

}
//get post comments
export async function handleGetPostComments(postId,limit=100,offset=0){
    console.log("trying to get post comments")
    const body = {
        postId: postId,
        limit: limit,
        offset: offset
    }
    console.log("body: ", body)
    return await fetch(`http://localhost:8080/posts/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then (async res => {
        console.log("res: ", res)
        if (res.status === 200) {
            console.log("post comments received")
            return await res.json()
        } else {
            console.log("post comments not received")
            return undefined
        }
    }).catch(e => {
        console.log("error: ", e)
    })
}

//fetch post recent likers
export async function handleGetPostRecentLikers(postId,limit=100,offset=0){
    console.log("trying to get post recent likers")
    const body = {
        postId: postId,
        limit: limit,
        offset: offset
    }
    console.log("body: ", body)
    return await fetch(`http://localhost:8080/posts/recentLikers`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then (async res => {
        console.log("res: ", res)
        if (res.status === 200) {
            console.log("post recent likers received")
            return await res.json()
        } else {
            console.log("post recent likers not received")
            return undefined
        }
    }).catch(e => {
        console.log("error: ", e)
    })
}

export async function handleGetPost(postID){
console.log("trying to get post")

    return await fetch(`http://localhost:8080/posts/getPost/${postID}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })

}
