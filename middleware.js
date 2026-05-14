const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){ // It checks whether the current request has a logged-in (authenticated) user or not. is a method provided by Passport.js
        req.session.redirectUrl =  req.originalUrl; //Because we want to redirect on current url(current url means the url from where the page ask the user to login) not on the previouse one.
        req.flash("error", "You must be logged in to create new listings!");
        return res.redirect("/login")
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{// Here we write this function to save req.session.redirectUrl inside our locals. 
    if(req.session.redirectUrl){ //Because due to passport it automatically delete (.redirectUrl) from (req.session) and it shows null value. But when we store this inside our locals the passport not able to delete it because passpost does not have the excess of locals.
        res.locals.redirectUrl = req.session.redirectUrl;
    }       
    next();
};

module.exports.isOwner = async(req, res, next) =>{
    let {id} = req.params;
   let listing = await Listing.findById(id);

   if(!listing){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
   if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You are not owner of this listing");
    return res.redirect(`/listings/${id}`);
   }

   next();
}

// Handeling errors using JOI for listing:
module.exports.validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// Handeling errors using JOI for Reviews:
module.exports.validateReview = (req,res,next)=>{
        let{error} = reviewSchema.validate(req.body);
        if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
        }else{
            next();
        }
    };


    module.exports.isReviewAuthor = async(req, res, next) =>{
    let {id, reviewId} = req.params;
   let review = await Review.findById(reviewId);
//    if(!listing){
//         req.flash("error", "Listing does not exist!");
//         return res.redirect("/listings");
//     }
   if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You are not author of this review");
    return res.redirect(`/listings/${id}`);
   }

   next();
}