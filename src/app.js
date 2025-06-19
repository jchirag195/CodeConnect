const express = require('express');
const connectDB = require("./config/database")
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/requests"); 
const profileRouter = require("./routes/profile");
const cookieParser = require('cookie-parser');
const app = express();

const User = require("./models/user");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter); 
app.use("/", requestRouter);  

//Get user by email
app.get("/user",async (req,res) => {
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({emailId: userEmail});
        if(!user){
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    // const users = await User.find({emailId: userEmail});
    // if(users.length === 0){
    //     res.status(404).send("User not found");
    // } else {
    //     res.send(users);
    // }
    } catch (err) {
        res.status(400).send("Something went wrong!")
    }

});

//Feed API - Get/Feed - get all the users from the database
app.get("/feed",async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong!");
    }
});
//Delete a user from the database
app.delete("/user", async(req,res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong!");
    }
})
// Update the user from the fdatabase
app.patch("/user/:userId",async (req,res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl","gender","age","skills"];
        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));
    if(!isUpdateAllowed) {
        throw new Error("Update not allowed");
    }
    if(data?.skills.length > 10) {
        throw new Error("Skills cannot be more than 10");
    }
        const user = await User.findByIdAndUpdate({_id : userId}, data,{returnDocument:'before',
        runValidators: true});
        res.send("User updated successfully");

    }catch (err) {
        res.status(400).send("Update failed!!" + err.message);
    }
})


connectDB().then(()=>{
    console.log("Database connection established");
    app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...")
});
}).catch(err => {
    console.error("Database cannot be connected!")
});