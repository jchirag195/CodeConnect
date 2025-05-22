const express = require('express');

const app = express();

app.use("/",(req,res) => {
    res.send("Namaste from the DashBoard")
});

app.use("/hello",(req,res) => {
    res.send("Hello there")
});

app.use("/test",(req,res) => {
    res.send("You are in the test page")
});

app.listen(7777, ()=>{
    console.log("Server successfully listening on Port 7777");
});