const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    gallery: [
        {
            // Reference to gallery model - "Gallery"
            type: Schema.Types.ObjectId, // <-- objectId of the photo model
            ref: "Gallery"
        }
    ]
});

// plugin will add on to the schema - requires user to enter username and pw.
// Makes sure it's unqiue
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);