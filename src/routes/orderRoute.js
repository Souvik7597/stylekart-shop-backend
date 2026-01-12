import express from "express";
import { hasToken } from "../middleware/hasToken.js";
import { createOrder, createPaymentIntent, deleteOrder, getAllOrder, getOrderByIdLoggedInUser, getStripeKey } from "../controllers/orderController.js";


const orderRoute = express.Router();

orderRoute.get("/getstripekey", hasToken, getStripeKey);
orderRoute.post("/orderspay", hasToken, createPaymentIntent);
orderRoute.post("/createorder", hasToken, createOrder)
orderRoute.get("/getallorders", hasToken, getAllOrder)
orderRoute.get("/getorder/:orderId", hasToken, getOrderByIdLoggedInUser)
orderRoute.delete("/order/:orderId", hasToken, deleteOrder);

export default orderRoute;