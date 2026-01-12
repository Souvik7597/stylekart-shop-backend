import Stripe from "stripe";
import dotenv from "dotenv/config";
import orderSchema from "../models/orderSchema.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getStripeKey = (req, res) => {
    res.status(200).json({
        key: process.env.STRIPE_PUBLISHABLE_KEY
    });
};

export const createPaymentIntent = async (req, res) => {
    try {
        const { totalPrice } = req.body;

        if (!totalPrice) {
            return res.status(400).json({
                success: false,
                message: "Total price required"
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100),
            currency: "inr",
            automatic_payment_methods: { enabled: true }
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { paymentIntentId, items, shippingAddress, totalPrice, paymentMethod } = req.body;

        if (!paymentIntentId || !items || !shippingAddress || !totalPrice || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({
                success: false,
                message: "Payment not verified"
            });
        }

        const order = await orderSchema.create({
            userId: req.userId,
            items,
            shippingAddress,
            totalPrice,
            paymentMethod,
            paymentIntentId,
            paymentStatus: "paid",
            isPaid: true,
            paidAt: new Date(),
            status: "confirmed"
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const getAllOrder = async (req, res) => {
    try {
        const orders = await orderSchema
            .find({ userId: req.userId })
            .populate("items.productId");

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrderByIdLoggedInUser = async (req, res) => {
    try {
        const order = await orderSchema.findById({ _id: req.params.orderId, userId: req.userId }).populate("items.productId");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await orderSchema.findOne({ _id: orderId, userId: req.userId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        await orderSchema.deleteOne({ _id: orderId });

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
