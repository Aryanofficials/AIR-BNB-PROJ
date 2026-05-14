if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// mongoos connection code
// const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderLust";
const dbUrl = process.env.ATLASDB_URL;

main().then((res)=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
   await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true})); // So that all the data comming inside request can easily parsed;
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    // crypto: {
    //     secret: process.env.SECRET
    // },
    touchAfter: 24 * 3600,
});

store.on("error", (err)=>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store: store,
    secret : process.env.SECRET,//THis is the secret use to sign the session cookie;
    resave : false,//The session will NOT be saved again if it wasn’t modified. Saves database/storage operations → better performance. IF resave: true (opposite behavior):Session is saved on every request, even if unchanged Can cause Extra load on your session store (DB, memory, etc.)
    saveUninitialized : true, //A session is created and saved even if you didn’t store any data in it. Example: User visits your site → session gets saved immediately. saveUninitialized: false means: Session is NOT saved until you actually store something in it. Eg: req.session.username = "Aryan";
    cookie : {
      expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly : true,
    },
};

app.use(session(sessionOptions));
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));// It means inside passport all the localStratgeys we made means all teh users and requestes are authenticated by local stratgey. And for this we use out authenticate method;

passport.serializeUser(User.serializeUser()); // Serialize means to store all the info about user inside a session;
passport.deserializeUser(User.deserializeUser());// Means to unstore all the info about the user from session; 

// To implement passport you must have implemented session;
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{ // Define middleware for flash
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser", async(req,res)=>{ // Here we create a fake user and then save it in DB using regester method.
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");//This regester method automatically going to save our fakeUser with the given password in DB; 
//     res.send(registeredUser);
// });

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// For listingsRouter
app.use("/listings", listingRouter);
// For reviewRouter
app.use("/listings/:id/reviews", reviewRouter);
// For userRouter
app.use("/", userRouter);



// This Error handeller handel all the incoming requests which are not with all the above routes:
app.use((req,res,next)=>{
    next(new ExpressError(404, "Page not found!"))
});

// Custome error handeller;
app.use((err, req, res, next) => {
   console.log(err);

   let { statusCode = 500, message = "Something went wrong" } = err;

   if (res.headersSent) {
      return next(err);
   }

   res.status(statusCode).render("error.ejs", { message });
});

// To start the server on port no 8080:
app.listen(8080, (req,res)=>{
    console.log("app is listening on port 8080");
});