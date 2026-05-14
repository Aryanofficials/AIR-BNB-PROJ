const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose").default;//Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.

const userSchema =new Schema({
    email : {
        type : String,
        required : true,
    }
});

userSchema.plugin(passportLocalMongoose);// We use user.plugins here because Passport-Local Mongoose will automatically add a username, hash and salt field to store the username, the hashed password and the salt value.

module.exports = mongoose.model("User", userSchema);
