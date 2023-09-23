import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";
import {getUserById} from "../db/user-db.js";
import cookie from "cookie"

const config = process.env

 export  const verifyToken = async (req, res, next) => {
     let cookies = parseCookies(req)
        // console.log("cookies: ", cookies)
     if (cookies.token1 === undefined) {
         return res.status(401).send("missing cookie")
     }


     // console.log("token1: ", cookies.token1)
     try {
         const decoded = jwt.verify(cookies.token1, config.JWT_SECRET)
         const user = await getUserById(decoded.id)
         if (!user) {
             return res.status(401).send("invalid token (!user)")
         }
         req.user = user
         // console.log("user: ", user)
     } catch (e) {
         return res.status(401).send("invalid token, error: " + e)
     }

     return next()
 }
//Check for token, create user object if found and valid named checkToken
export const checkToken = async (req, res, next) => {
    let cookies = parseCookies(req)
    // console.log("cookies: ", cookies)
    if (cookies.token1 === undefined) {
        return next()
    }
    try {
        const decoded = jwt.verify(cookies.token1, config.JWT_SECRET)
        const user = await getUserById(decoded.id)
        if (!user) {
            return res.status(401).send("invalid token (!user)")
        }
        req.user = user
    } catch (e) {
        return next()
    }

    return next()



}

export function parseCookies (request) {
    const list = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}
//get user from token
export const getUserFromSocketCookie = async (cookief = '') => {
    try {
        //print cookief
        let cookies = cookie.parse(cookief);
        console.log("cookies: ", cookies)
        const decoded = jwt.verify(cookies.token1, config.JWT_SECRET)
        const user = await getUserById(decoded.id)
        if (!user) {
            return null
        }
        return user
    } catch (e) {
        console.log("error: ", e)
    }
}