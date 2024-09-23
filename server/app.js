import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import voucherRoutes from "./routes/voucher.js";
import userRoutes from "./routes/users.js";
import categoryRoutes from "./routes/categories.js";
import subCategoryRoutes from "./routes/subCategories.js";
import productRoutes from "./routes/products.js";
import bannerRoutes from "./routes/banner.js";
import orderRoutes from "./routes/orders.js";
import wishListRoutes from "./routes/wishlist.js";
import upload from "./middleware/upload.js";
import dotenv from "dotenv";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import { updateProductCount } from "./controllers/products.js";
import Voucher from "./models/Voucher.js";
import { VoucherConstant } from "./utils/constant.js";
import moment from 'moment'
import Notification from "./models/Notification.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("./public/uploads"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.set("view engine", "ejs");
app.set("views", "./views");
const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", false);
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', 
  }
});

// routes
app.use("/auth", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/sub-categories", subCategoryRoutes);
app.use("/products", productRoutes);
app.use("/banners", bannerRoutes);
app.use("/orders", orderRoutes);
app.use("/wishlist", wishListRoutes);
app.use("/voucher", voucherRoutes);
app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json(req.file.filename);
});
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

const productViewers = {}; // productId: Set of userIds
const productNamespace = io.of("/products");
productNamespace.on('connection', (socket) => {
  // When a user views a product
  socket.on('viewProduct', async ({ productId, userId }) => {
    // await updateProductCount(productId, productViewers[productId]?.length)
    if (!productViewers[productId]) {
      productViewers[productId] = [userId];
    } else {
      if (!productViewers[productId]?.includes(userId)){
        productViewers[productId].push(userId);
      }else{
        productViewers[productId] = productViewers[productId].filter(Id => Id !== userId)
      }
       
    }
    socket.join(productId);
    productNamespace.to(productId).emit('viewerCount', productViewers[productId]?.length);
    
  });

  // When a user leaves the product or disconnects
  socket.on('leaveProduct', async ({ productId, userId }) => {
    if (productViewers[productId]) {
      productViewers[productId]= productViewers[productId].filter(Id=>Id!==userId); // Remove userId from the set
      productNamespace.to(productId).emit('viewerCount', productViewers[productId]?.length);
      // await updateProductCount(productId, productViewers[productId]?.length)
    }
  });

  socket.on('disconnect', (socket) => {
    console.log('A user disconnected');
  });
});

const notificationNamespaces = io.of("/notifications");

notificationNamespaces.on("connection", (socket) => {

  socket.on("connect-notification",async ({userId}) => {
    console.log(userId,'userId')
    socket.join(userId);
  });
  socket.on("send-notification-admin", async ({ userId, voucherId }) => {
    try {
      const updatedVoucher = await Voucher.findByIdAndUpdate(
        voucherId,
        { $addToSet: { user: userId } }, // Add userId to the array only if it's not already there
        { new: true } // Return the updated document
      );
      if (!updatedVoucher) {
        console.log("Something went wrong while updating voucher");
        return;
      }
      const message = `You have got one voucher with a code ${updatedVoucher?.code} valid upto ${moment(updatedVoucher?.expirationDate)?.format('MMM DD, YYYY hh:mm a')}`;
      const createdNotification = await Notification.create({
        user: userId,
        type: VoucherConstant?.Voucher,
        message: message
      }
      );
      if (!createdNotification) {
        console.log("Something went wrong while creating notification");
        return;
      }
    
      notificationNamespaces.to(userId).emit('notify-user', createdNotification);

    } catch (error) {
      throw new Error(error.message)
    }
  });
  socket.on("send-notification", async ({ userId, message }) => {
    try {

      const createdNotification = await Notification.create({
        user: userId,
        type: VoucherConstant?.Order,
        message: message
      }
      );
      if (!createdNotification) {
        console.log("Something went wrong while creating notification in send notification");
        return;
      }
    
      notificationNamespaces.to(userId).emit('notify-user', createdNotification);

    } catch (error) {
      throw new Error(error.message)
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected from the notifications namespace");
  });
});