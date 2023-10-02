const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

router.get("/register", (req, res) => {
    res.render("users/register");
})

// need to create user and add to mongodb
router.post("/register", catchAsync(async (req, res) => {
    try {
        // res.send(req.body);
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        // will hash the pw and store salt on that user
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        // login user after registering --> passport method 
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to DailyPhoto");
            res.redirect("/");
        });
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/users/register")
    }
}));


// get login form
router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: "/users/login", keepSessionInfo: true }), (req, res) => {
    req.flash("success", `Welcome back ${req.session.passport.user}!`);
    const redirectUrl = res.locals.returnTo || "/gallery";
    res.redirect(redirectUrl);
});

// logout requires a callback function to be passed in --> will handle any potential errors
router.get("/logout", (req, res) => {
    const username = req.session.passport.user;
    req.logout(function (err) {
        if (err) return next(err);
        req.flash("success", `Goodbye ${username}! Successfully logged out.`);
        res.redirect("/");
    });
});

module.exports = router;