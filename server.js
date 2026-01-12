import express from "express"
import dotenv from "dotenv/config"
import cors from "cors"
import userRoute from "./src/routes/userRoute.js";
import productRoute from "./src/routes/productRoute.js";
import cartRoute from "./src/routes/cartRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import { dbConnect } from "./src/config/dbConnect.js";

const app = express()
const port = process.env.PORT || 6001

const corsOptions = {
    origin: ["http://127.0.0.1:5500", "http://10.162.155.222:5500","https://stylekart-shop-frontend.vercel.app"], 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, 
    allowedHeaders: ["Content-Type", "Authorization"] 
}


app.use(cors(corsOptions))
app.use(express.json());

app.use("/api/v3", userRoute);
app.use("/api/v3", productRoute);
app.use("/api/v3", cartRoute);
app.use("/api/v3", orderRoute);

dbConnect();

app.listen(port,"0.0.0.0", () => {
    console.log(`Server is running at port ${port}`)
})