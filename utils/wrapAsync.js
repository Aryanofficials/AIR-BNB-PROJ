//We made this functin to wrap our async function.This functin is a unique function which returns an anither function AND inside this function its parameter is also a funciton which is (fn). Now, see first this wrapAsync fun returns an another function and this another functin which is returned by wrapAsync is now executes that function which is passes as an argument inside the wrapAsync.
module.exports = function wrapAsync(fn){ 
    return function(req,res,next){
        fn(req,res,next).catch(next);//If there is an error occure then next called and then we require this fun inside the app.js;
    }
}