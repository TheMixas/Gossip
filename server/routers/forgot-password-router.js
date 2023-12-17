import express from "express";
import {getUserByEmail, getUserById} from "../db/user-db.js";
import {storeResetPasswordToken, verifyResetPasswordToken} from "../db/forgot-password-db.js";
import forgotPswEmailTemplate from "../utils/EmailTemplates/forgot-psw-email-template.js";
import sendEmail from "../email.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import {pool} from "../db/database.js";

const router = express.Router()

router.get('/initiate-forgot-password/:email', async (req, res) => {
    //called when user submits email
    console.log("initiating reset password")
    try {
        //find user with email
        let user = getUserByEmail(req.params.email, "id")
        if (!user) {
            return res.status(404).send({error: "Email not found!"})
        }
        //generation random token with crypto
        let token = crypto.randomBytes(5).toString('hex');

        //hash token with bcrypt
        let hashedToken = await bcrypt.hash(token, 10)
        //store token in db
        await storeResetPasswordToken(req.params.email, hashedToken)
        //send email with token and link
        let template = forgotPswEmailTemplate(token, req.params.email)
        await sendEmail(template)

        return res.status(200).send("initiating reset password")
    } catch (e) {
        console.log(e)
        return res.status(500).send({error: e.message})
    }
})
//router for those who forgot to enter their email, return error
router.get('/initiate-forgot-password', async (req, res) => {
    res.status(400).send({error: "Please enter your email!"})
})

router.get(`/verify-forgot-password-token/:token/:email`, async (req, res) => {
    console.log("verifying reset password")
    //find token in db
    try {
        // get true / false from the db query depending if the token is valid
        if(await verifyResetPasswordToken(req.params.email,req.params.token))
        {
            res.status(200).send("token is valid")
        }
        else
        {
            res.status(400).send("token is invalid")
        }


    } catch (e) {
        console.log(e)
        res.status(500).send({error: e.message})

    }
})
//router for those who forgot to enter their email, return error
router.get('/verify-forgot-password-token', async (req, res) => {
    res.status(400).send({error: "Please enter your email!"})
})
router.post(`/finalize-password-reset`, async (req, res) => {
    const { token, newPassword, email } = req.body;
    console.log("finalizing reset password, bodfy: ", req.body)
    try {
        // Verify the token
        const isValidToken = await verifyResetPasswordToken(email, token);

        if (isValidToken) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Validate the email
            const [rows] = await pool.query(`SELECT gmail FROM users WHERE gmail = ?`, [email]);
            if (rows.length === 0) {
                return res.status(402).send("Invalid email");
            }

            // Update the user's password in the database
            await pool.query(`UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE gmail = ?`, [hashedPassword, email]);

            res.status(200).send("Password has been successfully updated");
        } else {
            console.log("Returning Invalid token, info: , token: ", token, "email: ", email);
            res.status(401).send("Invalid token");
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: e.message });
    }
});

export default router
