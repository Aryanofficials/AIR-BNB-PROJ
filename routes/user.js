const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controllers/users.js");


router.route("/signup")
.get(userController.renderSignupForm) // Get rout for signup
.post(wrapAsync(userController.signup));// Post route for signup


router.route("/login")
.get(userController.renderLoginForm)// Get route for Login
.post(// Post route for Login
    saveRedirectUrl,//In this as we login first it save the saveRedirectUrl the authenticate and login with passport and then redirectUrl is deleted from req.session
    passport.authenticate('local', // In this when req is sent to /login first passpost.authenticate middleware authenticate that is this user is present in the database or not
    {failureRedirect:"/login", failureFlash:true}), // If not then it redirect user on ligin using failureRedirect:"/login" and show an flash message using this failureFlash:true
    userController.login   
);
 

// Get route for Logout;
router.get("/logout", userController.logout)

module.exports = router;