import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new Schema(
    {
        vedioFile: {
            type: String, //from cloudinary url
            required: true,
        },
        thumbnail: {
            type: String, //from cloudinary url
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number, //from cloudinary url
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }
    , { timestamps: true });

vedioSchema.plugin(mongooseAggregatePaginate);

export const Vedio = mongoose.model("Vedio", vedioSchema);