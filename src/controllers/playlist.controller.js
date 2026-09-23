import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
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
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
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