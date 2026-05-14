const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js"); 
const { populate } = require("../models/review.js");
const listingControllers = require("../controllers/listings");
const multer  = require('multer'); //Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}); //NOTE: Multer will not process any form which is not multipart (multipart/form-data).
// In above 2 lines, In very first line we use multer to pasre form data and in 2nd line multer extract the files from form data and saves that files in a uplaoad named folder (That upload folder is automatically created by muter)

router.route("/") //router.route() is used in Express to handle multiple HTTP methods for the same route path in a cleaner way.
.get(wrapAsync(listingControllers.index))//  (Index route) => Get req to get all the data on page:
.post( // Create new route
    isLoggedIn,
    validateListing, // We add this method as a middle here;
    upload.single("listing[image]"),
    wrapAsync(listingControllers.createListings));

    // New Routes;
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingControllers.showListings))// Show Routes;
.put(// Update route:
    isLoggedIn,
    isOwner,
    validateListing,
    upload.single("listing[image]"),
     wrapAsync(listingControllers.updateListing))
.delete(isLoggedIn, // Delete route;
    isOwner,
    wrapAsync(listingControllers.destroyListing));

// Edit route;
router.get("/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync(listingControllers.renderEditForm));

module.exports = router;