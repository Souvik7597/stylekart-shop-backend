import express from "express";
import { hasToken } from "../middleware/hasToken.js";
import { createCart, getCartData } from "../controllers/cartController.js";


const cartRoute = express.Router();

cartRoute.post("/createccart", hasToken, createCart);
cartRoute.get("/getcart", hasToken, getCartData);

export default cartRoute;