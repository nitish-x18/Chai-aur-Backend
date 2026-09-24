import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {Video} from "../models/video.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if(!name || !description){
        throw new apiError(400, "name and description is required")
    }

    const userId = req.user._id

    if(!isValidObjectId(userId)){
        throw new apiError(400, "Invalid user")
    }

    const playlist = await Playlist.create(
        {
            name,
            description,
            videos,
            owner: userId
        }
    )

    if(!playlist){
        throw new apiError(400, "Failed to create Playlist")
    }

    return res
    .status(201)
    .json(
        new apiResponse(
            201, 
            playlist, 
            "Playlist created successfully"
        )
    )
 
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    const {userId} = req.params

    if(!userId){
        throw new apiError(400, "userId is required")
    }

    if(!isValidObjectId(userId)){
        throw new apiError(400, "Invalid user")
    }

    const playlist = await Playlist.find(
        {
            owner: userId
        }
    )

    if(playlist.length === 0){
        throw new apiError(400, "Playlist is not exist or found")
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            playlist,
            "Playlists fetched successfully"
        )
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    const {playlistId} = req.params

    if(!playlistId){
        throw new apiError(400, "Playlist Id is required")
    }

    if(!isValidObjectId(playlistId)){
        throw new apiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findOne(
        {
            _id: playlistId,
            owner: req.user._id
        }
    )

    if(playlist === null){
        throw new apiError(400, "playlist is not found")
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            playlist,
            "playlist fethced successfully"
        )
    )


})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!playlistId){
        throw new apiError(400, "playlist id is required")
    }

    if(!isValidObjectId(playlistId)){
        throw new apiError(400, "playlist id is invalid")
    }

    if(!videoId){
        throw new apiError(400, "video id is required")
    }

    if(!isValidObjectId(videoId)){
        throw new apiError(400, "video id is invalid")
    }

    const playlist = await Playlist.findOne(
        {
            _id: playlistId,
            owner: req.user._id
        }
    )

    if(playlist === null){
        throw new apiError(400, "playlist not exist")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(400, "video not exist")
    }

    const addToPlaylist = await Playlist.findByIdAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if(!addToPlaylist){
        throw new apiError(400, "video failed to added playlist")
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            addToPlaylist,
            "video added succesfully in playlist"
        )
    )

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    const {playlistId, videoId} = req.params

    if(!playlistId){
        throw new apiError(400, "Playlist Id is Required")
    }

    if(!isValidObjectId(playlistId)){
        throw new apiError(400, "Invalid Playlist Id")
    }

    if(!videoId){
        throw new apiError(400, "Video id is required")
    }

    if(!isValidObjectId(videoId)){
        throw new apiError(400, "Invalid Video Id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(400, "video not exist")
    }

    const removeVideo = await Playlist.findByIdAndUpdate(
        {
            _id: playlistId,
            owner: req.user._id
        },
        {
            $pull: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if(!removeVideo){
        throw new apiError(400, "Vedio could not be removed")
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            removeVideo,
            "Video removed successfully from playlist"
        )
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    const {playlistId} = req.params
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}