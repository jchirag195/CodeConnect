const mongoose  = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://jchirag195:vm4vYP8UcQd3Gvq2@namasenodejs.methab2.mongodb.net/CodeConnect");
};

module.exports = connectDB;
