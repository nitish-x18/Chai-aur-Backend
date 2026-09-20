import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    try {
        const { videoId } = req.params
        const { page = 1, limit = 10 } = req.query
    
        if (!videoId) {
            throw new apiError(400, "video id is required")
        }
    
        if (!isValidObjectId(videoId)) {
            throw new apiError(404, "video is not found")
        }
    
        const pageNumber = Number(page)
        const limitNumber = Number(limit)
    
        if (pageNumber < 1 || limitNumber < 1) {
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
    
        if (comments.length === 0) {
            throw new apiError(404, "commnet not found")
        }
    
        return res
            .status(200)
            .json(
                new apiResponse(200, comments, "succesfully getting all comments")
            )
    } catch (error) {
        console.log(error);
        throw error;
    }

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    try {
        const { videoId } = req.params
        const { content } = req.body
    
        if (!videoId) {
            throw new apiError(400, "video id is not found")
        }
    
        if (!isValidObjectId(videoId)) {
            throw new apiError(400, "video id is invalid")
        }
    
        if (!content) {
            throw new apiError(400, "comment is required")
        }
    
        const userId = req.user._id
    
        if (!userId) {
            throw new apiError(400, "userid is not found")
        }
    
        const comment = await Comment.create(
            {
                content,
                owner: userId,
                video: videoId
            }
        )
    
        if (!comment) {
            throw new apiError(400, "Failed to create comment")
        }
    
        return res
            .status(201)
            .json(
                new apiResponse(
                    201,
                    comment,
                    "comment created successfully"
                )
            )
    } catch (error) {
        console.log(error);
        throw error
    }

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    try {
        const { commentId } = req.params;
    
        if (!commentId) {
            throw new apiError(400, "comment id not found")
        }
    
        const { content } = req.body;
    
        if (!content) {
            throw new apiError(400, "comment is required")
        }
    
        const userId = req.user._id;
    
        if (!userId) {
            throw new apiError(400, "userid not found")
        }
    
        const comment = await Comment.findOneAndUpdate(
            {
                _id: commentId,
                owner: userId
            },
            {
                content: content
            },
            {
                new: true
            }
        )
    
        if (!comment) {
            throw new apiError(400, "failed to update comment")
        }
    
        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    comment,
                    "comment updated succesfully"
                )
            )
    } catch (error) {
        console.log(error)
        throw error
    }

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    try {
        const { commentId } = req.params;
    
        if (!commentId) {
            throw new apiError(400, "comment not found")
        }
    
        if (!isValidObjectId(commentId)) {
            throw new apiError(400, "commnt is invalid")
        }
    
        const comment = await Comment.findOneAndDelete(
            {
                _id: commentId,
                owner: req.user._id
            }
        )
    
        if (!comment) {
            throw new apiError(400, "Failed to delete comment")
        }
    
        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    null,
                    "commnet delete succesfully"
                )
            )
    } catch (error) {
        console.log(error);
        throw error
    }

})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}