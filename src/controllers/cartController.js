import cartSchema from "../models/cartSchema.js";

export const createCart = async (req, res) => {
    try {
        const { items } = req.body;

        let cart = await cartSchema.findOne({ userId: req.userId });

        if (cart) {
            cart.items.push(...items);
        } else {
            cart = new cartSchema({
                userId: req.userId,
                items
            });
        }

        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Product added to the cart",
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getCartData = async (req, res) => {
    try {
        const cart = await cartSchema.findOne({ userId: req.userId }).populate(
            "items.productId"
        );

        if (!cart) {
            return res.status(401).json({
                success: false,
                message: "Cart data not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart data fetch successfully",
            cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error in cart",
        });
    }
};