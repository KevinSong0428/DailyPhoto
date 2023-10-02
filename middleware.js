module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER...", req.user); <-- holds data from the user table
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        res.redirect("/login");
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}