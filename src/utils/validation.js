const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password, gender, photoUrl } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Please enter the valid Name!!");
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("First name should be between 4 to 50 characters.");
    } else if (lastName.length < 4 || lastName.length > 50) {
        throw new Error("Last name should be between 4 to 50 characters.");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Please enter a valid email id!!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be strong (include upper, lower, number, special char, and be at least 8 characters).");
    } else if (!["Male", "Female", "Other"].includes(gender)) {
        throw new Error("Gender must be Male, Female, or Other.");
    } else if (!validator.isURL(photoUrl)) {
        throw new Error("Photo URL must be valid.");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName","lastName","emailId","photoUrl0","gender","age","about","skills"];
    
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
};


module.exports = {
    validateSignUpData,validateEditProfileData
};