// require("dotenv").config({path: "./env"});/
import dotenv from "dotenv";
import connectDB from "./db/index.js";


//configration of dotenv-->
dotenv.config({
    path: "./env"
})

connectDB()
.then( () => {
    app.on("error", (error) => {
        console.log("ERROR: APP ERROR!!!", error);
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is runnong at port: ${process.env.PORT}`);
    })
})
.catch("error", (error) => {
    console.log('ERROR: FAILED to connect tot he dataBase',  error);
})

// BASIC APPROACH-->
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js";
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