const Joi = require("joi");
// const review = require("./models/review.js");

// For listing
module.exports.listingSchema = Joi.object({
    listing : Joi.object({ // here a listing object and this listing obj is always required
       title : Joi.string().required(),
       description : Joi.string().required(),
       price : Joi.number().required(), // These all are key : value pairs inside listings
       location : Joi.string().required(),
       country : Joi.string().required(),
       image: Joi.object({
    url: Joi.string().allow("", null)
}).optional()
    }).required() //this listing obj is always require
});


// For review:
module.exports.reviewSchema = Joi.object({
    review : Joi.object({
    rating : Joi.number().required().min(1).max(5),
    comment : Joi.string().required()
    }).required(),
});
