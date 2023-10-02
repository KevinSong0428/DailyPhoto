const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Gallery = require("../models/gallery");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const User = require("../models/user");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const colorPalette = require("../public/javascripts/getPalette");

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    var name = req.session.passport.user;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    // populate user with all photos they have
    const user = await User.findById(req.user._id).populate({ path: "gallery" });
    if (user.gallery.length === 0) {
        res.render("gallery/emptyIndex", { name, user });
    }
    res.render("gallery/index", { name, user });
}))

function convertDateFormat(originalDate) {
    const date = new Date(originalDate);
    const utcMonth = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Adding 1 since getUTCMonth() returns zero-based month (0-11)
    const utcDate = date.getUTCDate().toString().padStart(2, '0');
    const utcYear = date.getUTCFullYear();
    return `${utcMonth}/${utcDate}/${utcYear}`;
}


// form to add new date and photos
router.get("/new", isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate({ path: "gallery" });
    // pass in the dates that have already been created
    const takenDates = JSON.parse(JSON.stringify(user.gallery.map((gal) => gal.date)));
    const formattedTakenDates = takenDates.map(convertDateFormat);
    console.log("TAKEN DATES", formattedTakenDates)
    res.render("gallery/new", { formattedTakenDates });
}))

router.post("/new", isLoggedIn, upload.array("image"), catchAsync(async (req, res) => {
    console.log(req.body, req.files);
    // res.send(req.body);
    const user = await User.findById(req.user._id).populate({ path: "gallery" });
    const gal = new Gallery(req.body.gallery);
    gal.photos = req.files.map(f => ({ url: f.path, filename: f.filename }));

    // changing date property to format of mm/dd/yyyy
    const originalDate = gal.date;
    const utcMonth = originalDate.getUTCMonth() + 1; // Adding 1 since getUTCMonth() returns zero-based month (0-11)
    const utcDate = originalDate.getUTCDate();
    const utcYear = originalDate.getUTCFullYear();
    gal.date = `${utcMonth}/${utcDate}/${utcYear}`;

    try {
        // FUNCTION TO GET COLOR PALETTE - need to await every call
        await Promise.all(
            gal.photos.map(async (photo) => {
                const palette = await colorPalette(photo.url);
                photo.palette = palette;
            })
        );
    } catch (err) {
        console.log(err);
    }

    user.gallery.push(gal);

    // Sort the gallery array in memory
    user.gallery.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        const dayA = dateA.getUTCDate();
        const monthA = dateA.getUTCMonth();
        const yearA = dateA.getUTCFullYear();

        const dayB = dateB.getUTCDate();
        const monthB = dateB.getUTCMonth();
        const yearB = dateB.getUTCFullYear();

        // Compare year, month, and day components
        if (yearA !== yearB) {
            return yearA - yearB;
        }
        if (monthA !== monthB) {
            return monthA - monthB;
        }
        return dayA - dayB;
    });

    // Extract gallery IDs in sorted order
    const galleryIds = user.gallery.map(gallery => gallery._id);

    // Update the user document in MongoDB to reflect the sorted order
    await User.updateOne(
        { _id: user._id },
        { $set: { gallery: galleryIds } }
    );

    await gal.save();
    await user.save();
    req.flash("success", "Added a new day!");
    res.redirect("/gallery")
}))

// look at ONE SINGULAR image
router.get("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const gal = await Gallery.findById(id);
    const user = await User.findById(req.user._id).populate({ path: "gallery" });
    console.log(gal.date.getUTCFullYear());
    console.log(gal.date.getUTCMonth());
    console.log(gal.date.getUTCDate());
    console.log(gal.date.getUTCHours());
    console.log(gal.date.getUTCMinutes());
    console.log(gal.date.getUTCSeconds());
    console.log(gal.date)
    res.render("gallery/show", { gal, user })
}))

// edit ONE SINGULAR image
router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const gal = await Gallery.findById(id);
    const user = await User.findById(req.user._id).populate({ path: "gallery" });
    res.render("gallery/edit", { gal, user })
}));

// update
router.put("/:id", isLoggedIn, upload.array("image"), catchAsync(async (req, res) => {
    const { id } = req.params;
    const gal = await Gallery.findByIdAndUpdate(id, { ...req.body.gallery }, { new: true });
    if (req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        gal.photos.push(...imgs);
        try {
            // FUNCTION TO GET COLOR PALETTE - need to await every call
            await Promise.all(
                gal.photos.map(async (photo) => {
                    const palette = await colorPalette(photo.url);
                    photo.palette = palette;
                })
            );
        } catch (err) {
            console.log(err);
        }
    }
    await gal.save();
    if (req.body.deletePhotos) {
        for (let filename of req.body.deletePhotos) {
            await cloudinary.uploader.destroy(filename);
        }
        await gal.updateOne({ $pull: { photos: { filename: { $in: req.body.deletePhotos } } } });
    }
    req.flash("success", `Successfully Updated ${gal.date}!`);
    res.redirect(`/gallery/${id}`);
}))

// delete gallery and delete from user
router.delete("/:id/:user_id", isLoggedIn, catchAsync(async (req, res) => {
    const { id, user_id } = req.params;
    const gal = await Gallery.findByIdAndDelete(id);
    // find User by user_id and use $pull operator from gallery --> pulling id
    await User.findByIdAndUpdate(user_id, { $pull: { gallery: id } });
    for (let photo of gal.photos) {
        await cloudinary.uploader.destroy(photo.filename);
    }
    req.flash("success", `Successfully Deleted ${gal.date}!`);
    res.redirect(`/gallery`);
}))

module.exports = router;