const express = require('express');
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

authRouter.post("/signup",async (req, res) => {
    try{
    //Validation of the data
    validateSignUpData(req);
    const{firstName, lastName, emailId, password} = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password,10);

    //Creating a new instance of the user model
    const user = new User({firstName,lastName,emailId,password: passwordHash});
    await user.save();
    res.send("User added Successfully");
    } catch (err){
        res.status(400).send("ERROR: "+err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        const foundUser = await User.findOne({emailId:emailId});
        if(!foundUser){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if(isPasswordValid){
            // Create a JWT token
            const token = await jwt.sign({_id:foundUser._id},"CodeConnect$18");
            // Add the token to the cookie and send the response back to the user
            res.cookie("token", token);
            res.send("Login Successfull");
        } else {
            throw new Error("Invalid Credentials");
        }

    } catch (err){
        res.status(400).send("ERROR: "+err.message);
    }
})

authRouter.post("/logout", async (req, res) => {
    try {
        // Clear the cookie by setting its expiration date to a past date
        res.cookie("token", "", { expires: new Date(Date.now()) });
        res.send("Logout Successful!!");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = authRouter;

