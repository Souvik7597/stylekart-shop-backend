import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        unique: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        color: {
            type: String
        },
        size: {
            type: String
        }
    }]
}, { timestamps: true })

export default mongoose.model("cart", cartSchema)