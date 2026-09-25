import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const {videoId} = req.params

    if(!videoId){
        throw new apiError(400, "videoId is required")
    }

    if(!isValidObjectId(videoId)){
        throw new apiError(400, "Invalid videoId")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(400, "Video does not exist")
    }

    const like = await Like.exists(
        {
            video: videoId,
            likedBy: req.user._id
        }
    )

    if(like){
        await Like.findByIdAndDelete(like._id)

        return res
        .status(200)
        .json(
            new apiResponse(
                200,
                like,
                "Unlike successfully"
            )
        )
    } else {
        const newLike = await Like.create(
            {
                video: videoId,
                likedBy: req.user._id
            }
        )

        return res
        .status(201)
        .json(
            new apiResponse(
                201,
                newLike,
                "Liked Successfully"
            )
        )
    }
    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const {commentId} = req.params

    if(!commentId){
        throw new apiError(400, "comment id is required")
    }

    if(!isValidObjectId(commentId)){
        throw new apiError(400, "Invalid commentId")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new apiError(404, "Comment not exist")
    }

    const like = await Like.exists(
        {
            comment: commentId,
            likedBy: req.user._id
        }
    )

    if(like){
        await Like.findByIdAndDelete(like._id)

        return res
        .status(200)
        .json(
            new apiResponse(
                200,
                like,
                "unliked Succesfull"
            )
        )
    } else {
        const newLike = await Like.create(
            {
                comment: commentId,
                likedBy: req.user._id
            }
        )

        return res
        .status(201)
        .json(
            new apiResponse(
                201,
                newLike,
                "Comment Liked Succesfull"
            )
        )
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const {tweetId} = req.params

    if(!tweetId){
        throw new apiError(400, "tweet id is required")
    }

    if(!isValidObjectId(tweetId)){
        throw new apiError(400, "Invalid tweetId")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new apiError(404, "tweet does not exist")
    }

    const like = await Like.exists(
        {
            tweet: tweetId,
            likedBy: req.user._id
        }
    )

    if(like){
        await Like.findByIdAndDelete(like._id)

        return res
        .status(200)
        .json(
            new apiResponse(
                200,
                like,
                "unliked succesfully"
            )
        )
    } else {
        const newLike = await Like.create(
            {
                tweet: tweetId,
                likedBy: req.user._id
            }
        )

        return res
        .status(201)
        .json(
            new apiResponse(
                201,
                newLike,
                "liked tweet Succesfully"
            )
        )
    }

})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likeVideo = await Like.find(
        {
            likedBy: req.user._id
        }
    ).populate("video")

    if(likeVideo.length === 0){
        throw new apiError(404, "no liked video found")
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            likeVideo,
            "successfully get all liked video"
        )
    )

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}