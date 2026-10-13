import './SCSS/forgot-password.scss'
import './../../scss/typography.scss'
import forgorMonster from '../../svgs/forgor-monster.svg'
import {useCallback, useContext, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {
    finalizeForgotPassword,
    initiateForgotPassword,
    isPasswordResetEnabled,
    verifyForgotPasswordToken
} from "../../utils/ForgotPasswordCalls";
import {AuthModalContext} from "../context/auth-pop-up.context";
export default function ForgotPassword ({}) {
    const {setAuthPopup} = useContext(AuthModalContext)
    const [searchParams, setSearchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');

    const [token, setToken] = useState(searchParams.get('token') || '');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    // null while checking; false when the server has no email account set up (e.g. the online demo)
    const [resetEnabled, setResetEnabled] = useState(null);
    useEffect(() => {
        isPasswordResetEnabled().then(setResetEnabled);
    }, []);

    const handleEmailSubmit = () => {
        // Validate and send a request to the server to initiate the password reset
        // Transition to the next step (if entered by link)
        {
            //Initialise the password reset
            console.log('token is empty');
            initiateForgotPassword(email).then(r =>{
                // console r.status.toString()[0] === 2
                if(r.status.toString()[0] === "2"){
                    setStep(2);
                    setError('');
                }else{
                    setError('Email not found');
                }
            })
        }
    };

    const handleTokenSubmit = async () => {
        // Validate the token and set the new password
        // Transition to a success page or display an appropriate message
        let tokenValid = await verifyForgotPasswordToken(token,email).then(r => {
            console.log(r.status.toString()[0]);
            console.log("handletokensubmit r: ", r);
            if(r.status.toString()[0] === "2"){
                return true;
            }else{
                return false;
            }
        })
        if (token !== '' && tokenValid) {
            setStep(3);
            setError('');
            return;
        } else {
            setError('Enter a valid token');
        }
    };

    const handleNewPasswordSubmit = async () => {
        // Validate the new password and send a request to the server to update the password
        // Transition to a success page or display an appropriate message

        let response = await finalizeForgotPassword(token, newPassword, email);
        console.log("handleNewPasswordSubmit response: ", response);
        let success = response.status.toString()[0] === "2";

        if(!success){
            setError('Something went wrong');
            setStep(5)
        }
        else
        {
            //Success
            setStep(4);
            setError('');
        }
    }
    const handleTryAgain = () => {
        // Reset the form and transition to the first step
        // setStep(1);
        // setEmail('');
        // setToken('');
        // setNewPassword('');
        // setError('');#
        window.location.href = '/forgot-password';

    }

    const checkUrlForTokenAndEmail = async () => {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        //print out token and email
        console.log("token: ", token);
        console.log("email: ", email);

        if (token || email) {
            let tokenValid = await verifyForgotPasswordToken(token, email).then(r => {
                if (r.status.toString()[0] === "2") {
                    return true;
                } else {
                    return false;
                }
            });

            if (tokenValid) {
                setStep(3);
                setError('');
            } else {
                setStep(5)
                setError('Invalid token');
            }
        }
    };
    // If a token is present in the URL, skip the first two steps
    useEffect(() => {
            checkUrlForTokenAndEmail().then(r => console.log("r: ", r));
    }, []);
    return(
        <div className="forgot-password">
            <div className="forgot-password__container">
                <div className="forgot-password__container__header">
                    <h1 className={"heading-text color--light-1"}>Forgot Password</h1>
                    <img src={forgorMonster} alt=""/>
                </div>
                <div className="forgot-password__container__body">
                    {step === 1 && (
                        <div className="forgot-password__container__body__step1">
                            <div className="forgot-password__container__body__step1__input">
                                <h3>Enter your email</h3>

                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                                <h4>{error}</h4>


                                <div className="forgot-password__container__body__step1__button">
                                    <button onClick={() => handleEmailSubmit()} disabled={resetEnabled !== true}>
                                        {resetEnabled === false ? 'Disabled for this online demo' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="forgot-password__container__body__step2">
                            <div className="forgot-password__container__body__step2__input">
                                <h3>Check your inbox for a code.</h3>
                                <label htmlFor="token">Code</label>
                                <input type="text" name="token" id="token" value={token} onChange={(e) => setToken(e.target.value)}/>

                                <h4>{error}</h4>
                            </div>
                            <div className="forgot-password__container__body__step2__button">
                                <button onClick={() => handleTokenSubmit()}>Next</button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="forgot-password__container__body__step3">
                            <div className="forgot-password__container__body__step3__input">
                                <h3>Enter your new password</h3>

                                <label htmlFor="new-password">New Password</label>
                                <input type="password" name="new-password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                                <h4>{error}</h4>

                            </div>
                            <div className="forgot-password__container__body__step3__button">
                                <button onClick={() => handleNewPasswordSubmit()}>Next</button>
                            </div>
                        </div>
                    )}
                    {step === 4 && (
                        <div className="forgot-password__container__body__step4">
                            <div className="forgot-password__container__body__step4__input">
                                <h4>Password updated successfully</h4>
                            </div>
                            <div className="forgot-password__container__body__step4__button">
                                <button onClick={()=>setAuthPopup(true)}>Sign In</button>
                            </div>
                        </div>
                    )}
                    {
                        //unsuccesful
                        step === 5 && (
                            <div className="forgot-password__container__body__step5">
                                <div className="forgot-password__container__body__step5__input">
                                    <h5>Something went wrong</h5>
                                </div>
                                <div className="forgot-password__container__body__step5__button">
                                    <button onClick={()=>{handleTryAgain()}}>Try Again</button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    )
}