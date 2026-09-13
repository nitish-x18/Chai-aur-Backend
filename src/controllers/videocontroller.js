import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    try {
        const pipeline = [];

        // Only published videos
        pipeline.push({
            $match: {
                isPublished: true
            }
        });

        // Search by title or description
        if (query) {
            pipeline.push({
                $match: {
                    $or: [
                        {
                            title: {
                                $regex: query,
                                $options: "i"
                            }
                        },
                        {
                            description: {
                                $regex: query,
                                $options: "i"
                            }
                        }
                    ]
                }
            });
        }

        // Filter by user
        if (userId) {
            pipeline.push({
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            });
        }

        // Sorting
        const sort = {};

        if (sortBy) {
            sort[sortBy] = Number(sortType) || 1;
        } else {
            sort.createdAt = -1;
        }

        pipeline.push({
            $sort: sort
        });

        // Pagination
        const options = {
            page: Number(page),
            limit: Number(limit)
        };

        const result = await Video.aggregatePaginate(
            Video.aggregate(pipeline),
            options
        );

        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    result,
                    "Videos fetched successfully"
                )
            );
    } catch (error) {
        throw new apiError(500, "Something went wrong while getting all vedios")
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    try {

        const { tittle, description } = req.body;

        const videoLocalPath = req.files?.videoFile[0]?.path;
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

        if (!(tittle && description)) {
            throw new apiError(400, "Tittle or decription is empty");
        }

        if (!videoLocalPath) {
            throw new apiError(400, "Something went wrong while uploading Vedio")
        }

        if (!thumbnailLocalPath) {
            throw new apiError(400, "something went wrong while uploading the thumbnail")
        }

        const video = await uploadOnCloudinary(videoLocalPath);
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!video) {
            throw new apiError(400, "Error: video file is missing")
        }

        if (!thumbnail) {
            throw new apiError(400, "Error: thumbnail is missing")
        }

        const videoDocument = await Video.create({
            tittle,
            description,
            videoLocalPath: video.url,
            thumbnailLocalPath: thumbnail.url,
            duration: video.duration,
            owner: req.user._id
        })

        if (!videoDocument) {
            throw new apiError(500, "Something went wrong while publishing video");
        }

        return res
        .status(201)
        .json(
            new apiResponse(
                201,
                videoDocument,
                "Video published successfully"
            )
        );

    } catch (error) {
        console.log("Publish video error: ", error);
        throw error;
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}