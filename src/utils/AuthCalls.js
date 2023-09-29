import {apiURL} from "../api";

export function isAuthenticated(){
    
    return !!localStorage.getItem('gossip_user');
}
export function register(info={}, toggleAuthPopUp){
    
fetch(`${apiURL}/users/register`, {
        method: 'POST',
        body: JSON.stringify(info),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(
        (response) =>{
            if(response.error){
                throw new Error(response.error)
            }
            
            localStorage.setItem('gossip_user', JSON.stringify(response));
            toggleAuthPopUp();

        }
    ).catch((error)=>{
        
    alert(`register failed: ${error}`)
    })

}
export function login(info={},toggleAuthPopUp){
    
    fetch(`${apiURL}/users/login`, {
        method: 'POST',
        body: JSON.stringify(info),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => r.json()).then(
        (response) =>{
            if(response.error){
                throw new Error(response.error)
            }
            
            localStorage.setItem('gossip_user', JSON.stringify(response));
            toggleAuthPopUp();

        }
    ).catch((error)=>{
        
        alert(`login failed: ${error}`)
    })

}

export async function logout() {
    //call api to logout
    await fetch(`${apiURL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => {
        
    }).catch(e => {
        
    })

    localStorage.removeItem('gossip_user');
    window.location.reload();
}