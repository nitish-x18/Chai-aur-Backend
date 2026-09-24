import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

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
                likedBy: req.user._id,
                video: videoId
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
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}