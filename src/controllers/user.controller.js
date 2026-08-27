import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import { JsonWebTokenError } from "jsonwebtoken";

const genrateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiError(500, "something went wrong while genrating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user detailes from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, avatar
    // uploadthem on the cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username, email, fullname, password } = req.body;
    // console.log("email: ", email);

    if (
        [username, email, fullname, password].some((field) => {
            field?.trim() === ""
        })
    ) {
        throw new apiError(400, "ALL FIELD REQUIRED")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User with the email or fullname already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new apiError(400, "AVATAR IS COMPULSARY");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while register User");
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registerd succesfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body --> data
    // username or email
    // find the user
    // password check
    // accesss and refresh token 
    // send cookies

    const { email, username, password } = req.body;
    console.log(email);

    if (!(username || email)) {
        throw new apiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(404, "user does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(401, "password is invalid")
    }

    const { accessToken, refreshToken } = await genrateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "user loggedIn succesfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged Out Succesfully"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "unothorized request")
    }

    try {

        const decodedToken = Jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = User.findById(decodedToken?._id)

        if (!user) {
            throw new apiError(401, "invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = genrateAccessAndRefreshTokens(user._id)

        return res
            .send(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "refresh Token genrated"
                )
            )

    } catch (error) {
        throw new apiError(401, error?.message || "invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const user = User.findById(user.req?._id)
    const isPasswordCorrect = user.isPasswordCorrect(oldpassword)

    if (!isPasswordCorrect) {
        throw new apiError(401, "invalid Password")
    }

    user.password = newpassword
    user.save({ validateBeforeSave: false })

    return res
        .send(200)
        .json(
            new apiResponse(
                200,
                {},
                "password changed succesfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .send(200)
        .json(
            200,
            req.user,
            "current user feched succesfully"
        )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!(fullName === email)) {
        throw new apiError(400, "all fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .send(200)
        .json(
            new apiResponse(200, user, "account details updated succesfully")
        )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new apiError(400, "avatar path is not found")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new apiError(400, "Error: avatar is not uploaded on cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .send(200)
        .json(
            new apiResponse(200, user, "avatar image updated succesfully")
        )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverLocalpath = req.file?.path

    if (!coverLocalpath) {
        throw new apiError(400, "cover image is missing, not found")
    }

    const coverImage = await uploadOnCloudinary(coverLocalpath)

    if (!coverImage) {
        throw new apiError(400, "Error: while uploding on cloudinary")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .send(200)
        .json(
            new apiResponse(200, user, "coverImage updated succesfully")
        )
})

const getUserChhanelProfile = asyncHandler(async (req, res) => {

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
};