import { products } from "../../products.js"
import productSchema from "../models/productSchema.js"

export const createProduct = async (req, res) => {
    try {
        await productSchema.deleteMany()
        const productsData = await productSchema.insertMany(products)
        return res.status(201).json({
            success: true,
            productsData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getProductData = async (req, res) => {
    try {
        const { slug } = req.params; 

        if (slug) {
            const product = await productSchema.findOne({ slug });
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            return res.status(200).json({ success: true, product });
        }

        const products = await productSchema.find();

        return res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
