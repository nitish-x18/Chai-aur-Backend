import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto",
            // public_id: "my_dog",
            // overwrite: true,
            // notification_url: "https://mysite.example.com/notify_endpoint"
        })
        //filehass been uploaded succesfully
        console.log("File is uploaded on Cloudinary", response.url);
        return response;

    } catch (error) {
        //remove the locally saved temperary file as the uploaded operation got failed
        fs.unlinkSync(localfilepath);
        return null;
    }
}