import {pool} from "./database.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function storeResetPasswordToken(email, hashedToken){
    try{
        let date = new Date();
        date.setHours(date.getHours() + 1); // Token expires after 1 hour
        let expires = date.toISOString().slice(0, 19).replace('T', ' ');

        return await pool.query(`UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE gmail = ?`, [hashedToken, expires, email])
    }
    catch (e){
        console.log("sql error:", e)
    }
}
export async function verifyResetPasswordToken(email, token){
    try{
        console.log("verifying token")
        console.log("email:", email)
        console.log("token:", token)
        let currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const [rows] = await pool.query(`SELECT reset_token FROM users WHERE gmail = ? AND reset_token_expires > ?`, [email, currentTime])

        if (rows.length === 0) {
            console.log("no rows")
            return false;
        }

        //return comparison
        console.log("token:", token)
        console.log("rows[0].reset_token:", rows[0].reset_token)
        return await bcrypt.compare(token, rows[0].reset_token)
    }
    catch (e){
        console.log("sql error:", e)
    }
}