const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GallerySchema = new Schema({
    desc: String,
    date: {
        type: Date,
        required: true,
        unique: true
    },
    photos: [
        {
            url: String,
            filename: String,
            palette: [String],
        },
    ],
    time: String
});

module.exports = mongoose.model("Gallery", GallerySchema);
