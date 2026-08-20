// require("dotenv").config({path: "./env"});/
import dotenv from "dotenv";

import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";
import connectDB from "./db/index.js";

connectDB();

//configration of dotenv-->
dotenv.config({
    path: "./env"
})

// BASIC APPROACH-->
// import express from "express";
// const app = express();

// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.log("ERROR: NOT CONNECT TO EXPRESS", error);
//             throw error;
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listenin on Port ${process.env.PORT}`);
//         })
        
//     } catch (error) {
//         console.error("Error", error);
//         throw error;
//     }
// })();