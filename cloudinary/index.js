const cloudinary = require("cloudinary").v2;
const { model } = require("mongoose");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// configure cloudinary OBJECT
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "DailyPhoto",
        allowedFormats: ["jpeg", "png", "jpg"]
    }
});

module.exports = {
    cloudinary,
    storage
}