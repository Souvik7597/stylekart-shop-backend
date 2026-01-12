import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        min: 0,
        max: 100
    },
    listPrice: {
        type: Number
    },
    images: [
        String
    ],
    gender: {
        type: String
    },
    category: {
        type: String
    },
    brand: {
        type: String
    },
    tags: [
        String
    ],
    isPublished: {
        type: Boolean,
        default: false
    },
    avgRating: {
        type: Number,
        default: 0
    },
    numSales: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    countStock: {
        type: Number,
        default: 0
    },
    colors: [
        String
    ],
    sizes: [
        String
    ],
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String
    }]

}, { timestamps: true });

export default mongoose.model("product", productSchema);