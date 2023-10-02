if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");  // <-- helps to make sense of ejs
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");

// ROUTES
const galleryRoutes = require("./routes/gallery");
const userRoutes = require("./routes/users");

mongoose.connect('mongodb://127.0.0.1:27017/test');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected")
})

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


const sessionConfig = {
    secret: "secret", // <-- NEEDS TO BE CHANGED!
    resave: false,
    saveUninitialized: true,
    // options for cookies sent back
    cookie: {
        // protect cookie from third party sources
        httpOnly: true,
        // max length of a cookie is one week -- time is in milliseconds
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// express session comes before passport session
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
// authenticate User is correct
passport.use(new LocalStrategy(User.authenticate()));
// how to store a User IN the session and how to get a User OUT of the session 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to handle flash and user info
app.use((req, res, next) => {
    // local variable in the session
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.use('/users', userRoutes);
app.use("/gallery", galleryRoutes);


app.get('/', (req, res) => {
    res.render("home");
})

// PREVENT THIRD PARTY FROM ADDING TO DATABASE
// when posting, if req.body has nothing in there, throw new ExpressError

// catch all requests that makes it here
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

// this will be the Next for any errors
app.use((err, req, res, next) => {
    // console.log(err)
    const { message = "Error", status = 500 } = err;
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})