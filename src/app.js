import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


//routes import-->
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import commnetRouter from "./routes/comment.routes.js";


//router declaration-->
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/comment", commnetRouter);

console.log("USER ROUTER LOADED");

export { app };