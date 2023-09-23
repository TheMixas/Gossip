export function isAuthenticated(){
    
    return !!localStorage.getItem('gossip_user');
}
export function register(info={}, toggleAuthPopUp){
    
fetch('http://localhost:8080/users/register', {
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
    
    fetch('http://localhost:8080/users/login', {
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
    await fetch(`http://localhost:8080/users/logout`, {
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