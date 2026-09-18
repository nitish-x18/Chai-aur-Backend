import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    try {
        const { content } = req.body;
    
        if(!content) {
            throw new apiError(400, "content is required")
        }
    
        const userId = req.user._id;
    
        if(!userId){
            throw new apiError(400, "userId is not found")
        }
    
        const tweet = await Tweet.create({
            content,
            owner: userId
        })
    
        if(!tweet){
            throw new apiError(400, "Failed to create tweet")
        }
    
        return res
        .status(201)
        .json(
            new apiResponse(201, tweet, "tweet created succesfully")
        )
    } catch (error) {
        console.log(error);
        throw error;
    }
    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;

    if(!userId){
        throw new apiError(400, "UserId is required")
    }

    if(!isValidObjectId(userId)){
        throw new apiError(400, "the userid is not exist");
    }

    const tweets = await Tweet.find({
        owner: userId
    });

    if(tweets.length === 0){
        throw new apiError(400, "Tweet is not found")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200, tweets, "Succesfully get user tweet")
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}