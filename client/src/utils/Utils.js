export const getLastPathSegment = (path) =>{
   return path.toString().substring(path.lastIndexOf('/') + 1);
}
//get username from localstorage
export const getUsername = () =>{

    if(!localStorage.getItem("gossip_user")){
        return null;
    }
    
    

    return JSON.parse(localStorage.getItem("gossip_user")).username;
}
export const getName = () =>{

    if(!localStorage.getItem("gossip_user")){
        return null;
    }
    
    

    return JSON.parse(localStorage.getItem("gossip_user")).name;
}
export const getID = () =>{
    if(!localStorage.getItem("gossip_user")){
        
        return null;
    }
    
    return JSON.parse(localStorage.getItem("gossip_user")).id;
}
export const getUsernameFromID = async (id) =>{
    let response = await fetch(`/users/${id}/username`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if(response.status === 200){
        let data = await response.json()
        return data.username
    }else{
        return null
    }

}

//clear account info from localstorage
export const clearAccountInfo = () =>{
    localStorage.removeItem("gossip_user");
}
export  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Split the result on the comma and return the second part
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}