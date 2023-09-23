export function isAuthenticated(){
    console.log('isAuthenticated',!!localStorage.getItem('gossip_user'))
    return !!localStorage.getItem('gossip_user');
}
export function register(info={}, toggleAuthPopUp){
    console.log('register info: ',info)
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
            console.log('username',response.username)
            localStorage.setItem('gossip_user', JSON.stringify(response));
            toggleAuthPopUp();

        }
    ).catch((error)=>{
        console.log('e',error)
    alert(`register failed: ${error}`)
    })

}
export function login(info={},toggleAuthPopUp){
    console.log('login info: ',info)
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
            console.log('username',response.username)
            localStorage.setItem('gossip_user', JSON.stringify(response));
            toggleAuthPopUp();

        }
    ).catch((error)=>{
        console.log('e',error)
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
        console.log(`response: `, r)
    }).catch(e => {
        console.log(`error: `, e)
    })

    localStorage.removeItem('gossip_user');
    window.location.reload();
}