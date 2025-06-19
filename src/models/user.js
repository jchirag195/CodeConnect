const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address");
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Please enter valid Password")
            }
        },
    },
    age: {
        type: Number,
        min: 18,
        max: 100, 
    },
    gender: {
        type: String,
        lowerCase:true,
    enum: ['Male', 'Female', 'Other'],
    message: 'Gender is not valid'
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm-TruksPXPI5imDL_kfzEfFiAZwg5AzHtWg&s",
        validate: {
            validator: (val) => validator.isURL(val),
            message: 'Photo URL must be valid.'
        },
    },
    about: {
        type: String,
        default: "This is a Default About of the User!",
    },
    skills: {
        type: [String]
    },
},{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);