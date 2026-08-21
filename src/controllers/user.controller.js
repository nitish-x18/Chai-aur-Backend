import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {User} from "../model/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {apiResponse} from "../utils/apiResponse.js";


const registerUser = asyncHandler( async (req, res) => {
    // get user detailes from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, avatar
    // uploadthem on the cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {username, email, fullname, password} = req.body;
    console.log("email: ", email);

    if (
        [username, email, fullname, password].some((field) => {
            field?.trim() === ""
        }) 
    ){
        throw new apiError(400, "ALL FIELD REQUIRED")
    }

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new apiError(409, "User with the email or fullname already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new apiError(400, "AVATAR IS COMPULSARY");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    const user = await user.create({
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

    if(!createdUser) {
        throw new apiError(500, "Something went wrong while register User");
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registerd succesfully")
    )

})

export {registerUser};