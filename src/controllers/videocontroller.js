import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import cloudinary from 'cloudinary'


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
        console.log(error);
        throw error;
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    // const { title, description } = req.body
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
            videoFile: video.url,
            thumbnail: thumbnail.url,
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
    try {
        const { videoId } = req.params
    
        const video = await Video.findById(videoId);
    
        if(!video){
            throw new apiError(400, "Video not Found")
        }
    
        return res
        .status(200)
        .json(
            new apiResponse(
                200,
                video,
                "video Find Successfully"
            )
        )
    } catch (error) {
        console.log("get video by id ERROR: ", error);
        throw error;
    }
})

const updateVideo = asyncHandler(async (req, res) => {

    try {
        const { videoId } = req.params;
    
        if(!videoId){
            throw new apiError(400, "Vedio not Found")
        }
    
        const { tittle, description } = req.body;
    
        const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
        let thumbnailUrl;
    
        if(thumbnailLocalPath){
            const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    
            if(!thumbnail?.url){
                throw new apiError(400, "Thumbnail upload fail")
            }
        }
    
        const updateData = {
            //     $set :{
            //     tittle,
            //     description,
            //     ...(thumbnailUrl && { thumbnail: thumbnailUrl })
            // }
        };

        if(tittle){
            updateData.tittle = tittle;
        }

        if(description){
            updateData.description = description;
        }

        if(thumbnailUrl){
            updateData.thumbnail = thumbnailUrl
        }
    
        const video = await Video.findByIdAndUpdate(
            {
                _id: videoId,
                owner: req.user._id
            },
            updateData, 
            {
                new: true
            }
        );
    
        return res
        .status(200)
        .json(
            new apiResponse(
                200, 
                video, 
                "Video data updated successfully"
            )
        );
    } catch (error) {
        console.log(error);
        throw error;
    }

});

const deleteVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        
        if(!videoId){
            throw new apiError(400, "vedio id not Found")
        }
    
        const video = await Video.findOne({
            _id: videoId,
            owner: req.user._id
        })
    
        if(!video){
            throw new apiError(400, "video not found")
        }
    
        if(video.videoFile){
            const videoPublicId = video.videoFile
            .split('/')
            .slice(-1)[0]
            .split('.')[0]
    
            await cloudinary.uploader.destroy(videoPublicId, {
                resource_type: "video"
            });
        }
    
        if(video.thumbnail){
            const thumbnailPublicId = video.thumbnail
            .split('/')
            .slice(-1)[0]
            .split('.')[0]
    
            await cloudinary.uploader.destroy(thumbnailPublicId, {
                resource_type: 'image'
            })
        }
    
        await Video.findByIdAndDelete(videoId);
    
        return res
        .status(200)
        .json(
            new apiResponse(
                200,
                video,
                "video deleted"
            )
        )
    } catch (error) {
        console.log(error);
        throw error;
    }

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