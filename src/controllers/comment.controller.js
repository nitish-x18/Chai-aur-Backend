import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
        throw new apiError(400, "video id is required")
    }

    if(!isValidObjectId(videoId)){
        throw new apiError(404, "video is not found")
    }

    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    if(pageNumber < 1 || limitNumber < 1){
        throw new apiError(400, "page and li it must be greater than 0")
    }

    const skip = (pageNumber - 1) * limitNumber;

    const comments = await Comment.find(
        {
            video: videoId,
        }
    )
    .skip(skip)
    .limit(limitNumber)

    if(comments.length === 0){
        throw new apiError(404, "commnet not found")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200, comments, "succesfully getting all comments")
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }