import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        quantity: { type: Number, default: 1 },
        color: String,
        size: String
    }],

    totalPrice: {
        type: Number,
        required: true
    },

    shippingAddress: {
        fullName: String,
        email: String,
        address: String,
        city: String,
        state: String,
        postalCode: String
    },

    paymentMethod: {
        type: String,
        enum: ["stripe", "cod"],
        required: true
    },

    paymentIntentId: {
        type: String
    },

    paymentStatus: {
        type: String,
        default: "pending"
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    paidAt: {
        type: Date,
        default: Date.now()
    },

    status: {
        type: String,
        default: "processing"
    }

}, { timestamps: true });

export default mongoose.model("order", orderSchema);
