const { check, validationResult } = require('express-validator');

const nodemailer = require("nodemailer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { firsNameValidation, lastNameValidation, emailValidation, passwordValidation, confirm_passwordValidation, userTypeValidation, termsAcceptedValidation } = require('./validation');
const sendMail = require('../utils/sendMail');

exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/login'); 
    }
    next();
  };

exports.getLogin = (req,res,next) => {
    res.render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: req.isLoggedIn || false,   
        })
}

exports.postLogin = async(req, res, next) => {

    const { email, password } = req.body;

    const LowerEmail = email.toLowerCase()

    try{
        const user = await User.findOne({email:LowerEmail});

        if(!user){
            return res.render("auth/login", {
                pageTitle : "Login",
                isLoggedIn: false,
                currentPage: "login",
                errorMessages: "Inavlid Email"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.render("auth/login", {
                pageTitle : "Login",
                isLoggedIn: false,
                currentPage: "login",
                errorMessages: "Inavlid Password"
            })
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        // await req.session.save();

        req.session.save((err) => {
            if (err) {
                console.log("Session save error:", err);
                return res.redirect("/login");
            }
            res.redirect("/"); 
        });

    }
    catch(err){
        console.log("Error while logging in: ", err);
    }
}

exports.postLogout = (req,res,next) => {
    req.session.destroy(function(){
        res.redirect("/login");
    });
}

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        pageTitle: "Login",
        currentPage: "signup",
        isLoggedIn: false
    })
}

exports.postSignup = [
    firsNameValidation,
    lastNameValidation,
    emailValidation,
    passwordValidation,
    confirm_passwordValidation,
    userTypeValidation,
    termsAcceptedValidation,

    async (req,res,next) => {
        console.log("User came for signup: ", req.body);
        const {firstName, lastName, email, password, userType} = req.body
        const errors = validationResult(req);  

        if(!errors.isEmpty()){
            return res.status(422).render("auth/signup", {        
                pageTitle : "Sign Up",
                currentPage : "signup",
                isLoggedIn : false,
                errorMessages: errors.array().map(error =>  error.msg),   
                oldInput: {   
                    firstName, lastName, email, password, userType
                }
            })
        }

        bcrypt.hash(password, 12).then(function(hashedPassword){
            const user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                userType: userType
            });
    
            user.save()
            .then(() => {
                res.redirect("/login");
            })
            .catch(err => {
                console.log("Error while creating user: ", err);
            })
        })    
        
        const subject = `Welcome to Airbnb Home, ${firstName}! 🎉`

        const text = `
        Welcome to Airbnb Home, ${firstName}!

        We're thrilled to have you join our community of travelers and hosts. Your account has been successfully created and you're all set to begin your journey with us.

        What you can do now:
        - Browse unique homes and experiences
        - Save your favorite properties
        - Book your next stay
        - Connect with hosts worldwide

        If you're planning to host, you can also list your property and start earning.

        Need help? Our support team is always here to assist you.

        Best regards,
        The Airbnb Home Team

        P.S. For your security, please make sure to keep your account credentials safe.
`

        const html = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #484848; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #FF5A5F;">Welcome to Airbnb Home! 🏠</h1>
            </div>

            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #484848;">Hi ${firstName},</h2>
                
                <p style="margin-bottom: 20px;">We're excited to have you join our global community of travelers and hosts! Your account has been successfully created, and you're ready to begin your journey with us.</p>

                <div style="background-color: #F7F7F7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #FF5A5F; margin-top: 0;">What you can do now:</h3>
                    <ul style="list-style-type: none; padding-left: 0;">
                        <li style="margin-bottom: 10px;">✨ Explore unique homes worldwide</li>
                        <li style="margin-bottom: 10px;">❤️ Save your favorite properties</li>
                        <li style="margin-bottom: 10px;">🏡 Book your perfect stay</li>
                        <li style="margin-bottom: 10px;">💬 Connect with hosts globally</li>
                    </ul>
                </div>

                ${userType === 'host' ? `
                <div style="background-color: #FFE8E8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #FF5A5F; margin-top: 0;">Ready to become a host?</h3>
                    <p>Start listing your property and join our community of successful hosts!</p>
                </div>
                ` : ''}

                <p style="margin-top: 20px;">Need any help? Our support team is always here to assist you!</p>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #EBEBEB;">
                    <p style="margin-bottom: 0;">Best regards,</p>
                    <p style="margin-top: 5px; color: #FF5A5F; font-weight: bold;">The Airbnb Home Team</p>
                </div>
            </div>

            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #767676;">
                <p>For your security, please keep your account credentials safe.</p>
            </div>
        </body>
        </html>
        `      

        await sendMail(email, subject, text, html);
    }
    
]

exports.getForgotPassword = (req, res, next) => {
    res.render("auth/forgot", {
        pageTitle: "Forgot Password",
        isLoggedIn: false,
        currentPage: "login",
    })
}

exports.postForgotPassword = async(req, res, next) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 20 * (60*1000)  //data.now + 20 mins
        await user.save();

        const subject = "Here is your OTP to reset your Password";
        const text = `
        Your One-Time Password (OTP)

        Here is your OTP for Airbnb Home: ${otp}
        
        This OTP will expire in 20 minutes.
        
        For your security:
        - Never share this OTP with anyone
        - Our team will never ask for your OTP
        - Make sure you're on our official website
        
        If you didn't request this OTP, please ignore this email.
        
        Best regards,
        The Airbnb Home Team
        `;

        const html = `
        <!DOCTYPE html>
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #484848; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #FF5A5F;">Your OTP Code</h1>
                    </div>

                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #484848;">Hello!</h2>

                        <p style="margin-bottom: 20px;">Here's your One-Time Password (OTP) for Airbnb Home:</p>

                        <div style="background-color: #F7F7F7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                            <h2 style="color: #FF5A5F; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h2>
                            <p style="margin-top: 10px; color: #767676;">This code will expire in 20 minutes</p>
                        </div>

                        <div style="background-color: #FFE8E8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #FF5A5F; margin-top: 0;">Security Notice:</h3>
                            <ul style="list-style-type: none; padding-left: 0;">
                                <li style="margin-bottom: 10px;">🔒 Never share this OTP with anyone</li>
                                <li style="margin-bottom: 10px;">⚠️ Our team will never ask for your OTP</li>
                                <li style="margin-bottom: 10px;">✓ Verify you're on our official website</li>
                            </ul>
                        </div>

                        <p style="margin-top: 20px; color: #767676;">If you didn't request this OTP, please ignore this email.</p>

                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #EBEBEB;">
                            <p style="margin-bottom: 0;">Best regards,</p>
                            <p style="margin-top: 5px; color: #FF5A5F; font-weight: bold;">The Airbnb Home Team</p>
                        </div>
                    </div>
                </body>
        </html>
        `

        await sendMail(email, subject, text, html)

        res.redirect(`/reset-password?email=${email}`);
    }catch(err){
        res.render("auth/forgot", {
            pageTitle : "Forgot Password",
            isLoggedIn: false,
            currentPage: "login",
            errorMessages : [err.message]
        })
    }
}

exports.getResetPassword = (req,res,next) => {
    const {email} = req.query;
    res.render("auth/reset_password",{
        pageTitle: "Reset Password",
        currentPage: "login",
        isLoggedIn: false,
        email:email,
        })
}


exports.postResetPassword = [
    passwordValidation,
    confirm_passwordValidation,

    async (req, res, next) => {
        const{email, otp, password, confirm_passowrd } = req.body;
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).render("auth/reset_password",{
                pageTitle: "Reset Password",
                currentPage: "login",
                isLoggedIn: false,
                email:email,
                errorMessages: errors.array().map(err => err.msg),
            })
        }

        try{
            const user = await User.findOne({email});
            if (!user) {

                throw new Error('User not found');

            } else if (user.otpExpiry < Date.now()) {

                throw new Error('OTP Expired');

            } else if (user.otp !== otp) {

                throw new Error('OTP does not match');

            }

            const hashedPassword = bcrypt.hash(password,12);
            user.password = (await hashedPassword).toString();
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();

            res.redirect("/login");

        }
        catch(err){
            console.log(err);
            res.render('auth/reset_password', {
              pageTitle: 'Reset Password',
              isLoggedIn: false,
              currentPage: "login",
              email: email,
              errorMessages: [err.message]
            });    
        }
    }
]