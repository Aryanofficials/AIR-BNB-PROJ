const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signup = async(req,res,next)=>{
    try{
   let {username, email, password} = req.body;
   const newUser = new User({username, email});
   const registeredUser = await User.register(newUser, password);
//    console.log(registeredUser);
    req.login(registeredUser, (err)=>{
       if(err){
        return next(err);
       }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
    })
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm =  (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login =  async(req,res)=>{
   req.flash("success", "Welcome back to Wanderlust!");
   let redirectUrl = res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl); //Because here we want it to redirect on current url the url from when the user login not redirect on the home page which is listing.
};

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{//req.logout is a predefined method of passpost which delete the suer from session using serialize or deserializing mothods. req.logout is bassically a callback;
    if(err){
       return next(err);
    }
    req.flash("success", "You are successfully logged out!");
    res.redirect("/listings");
    }); 
};


