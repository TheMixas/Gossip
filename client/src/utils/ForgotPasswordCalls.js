import { apiURL } from "../api";
// Resolves to true/false: whether the server can send password-reset emails
export function isPasswordResetEnabled() {
    return fetch(`${apiURL}/features/password-reset`)
        .then(r => r.json())
        .then(d => d.enabled === true)
        .catch(() => false);
}
export function initiateForgotPassword(email="") {
    console.log("initiating forgot password, email: ", email);
    return fetch(`${apiURL}/initiate-forgot-password/${email}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    });
}
export function verifyForgotPasswordToken(token="", email="") {
    console.log("verifying forgot password token: ", token);
    return fetch(`${apiURL}/verify-forgot-password-token/${token}/${email}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    });
}
export function finalizeForgotPassword(token="", newPassword="", email="") {
    console.log("finalizing forgot password, token: ", token, "newPassword: ", newPassword, "email: ", email);
    return fetch(`${apiURL}/finalize-password-reset`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, newPassword, email })
    });
}


