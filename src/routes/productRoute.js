import express from "express";
import { createProduct, getProductData } from "../controllers/productController.js";


const productRoute = express.Router()

productRoute.post("/createProduct", createProduct);
productRoute.get("/products", getProductData)
productRoute.get("/product/:slug", getProductData);

export default productRoute;