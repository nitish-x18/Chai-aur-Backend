import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    try {
        const { content } = req.body;

        if (!content) {
            throw new apiError(400, "content is required")
        }

        const userId = req.user._id;

        if (!userId) {
            throw new apiError(400, "userId is not found")
        }

        const tweet = await Tweet.create({
            content,
            owner: userId
        })

        if (!tweet) {
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

    if (!userId) {
        throw new apiError(400, "UserId is required")
    }

    if (!isValidObjectId(userId)) {
        throw new apiError(400, "the userid is not exist");
    }

    const tweets = await Tweet.find({
        owner: userId
    });

    if (tweets.length === 0) {
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
    try {
        const { tweetId } = req.params;
    
        if (!tweetId) {
            throw new apiError(400, "tweetId is not found")
        }
    
        if(!isValidObjectId(tweetId)){
            throw new apiError(400, "invalid tweet id")
        }
    
        const { newContent } = req.body
    
        if (!newContent) {
            throw new apiError(400, "Content is required")
        }
    
        const updateData = {
            content: newContent
        }
    
        const tweet = await Tweet.findByIdAndUpdate(
            {
                _id: tweetId,
                owner: req.user._id
            },
            updateData,
            {
                new: true
            }
        )
    
        if (!tweet) {
            throw new apiError(404, "Tweet not found")
        }
    
        return res
        .status(200)
        .json(
            new apiResponse(200, tweet, "succesfully updated")
        )
    } catch (error) {
        console.log(error);
        throw error;
    }

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if(!tweetId){
        throw new apiError(400, "tweet is required")
    }

    if(!isValidObjectId(tweetId)){
        throw new apiError(400, "tweet is invalid")
    }

    const tweet = await Tweet.findByIdAndDelete(
        {
            _id: tweetId,
            owner: req.user._id
        }
    )

    if(!tweet){
        throw new apiError(404, "tweet not found")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200, null, "tweet deleted succesfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}