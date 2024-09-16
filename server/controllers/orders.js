import mongoose from "mongoose";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
export const getAllOrders = async (req, res) => {
  const orderList = await Order.find().populate("user").sort({ createdAt: -1 });
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(orderList);
};
export const createOrder = async (req, res) => {
  const user = req.user;
  const orderItems = await OrderItem.find({ user: user.id , isPlaced:false}).populate(
    "product",
    "price"
  );
  const orderItemsIds = orderItems.map((item) => item._id);

  const totalPrices = orderItems.map((item) => {
    const totalPrice = item.product.price * item.quantity;
    return totalPrice;
  });

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    productsList: orderItemsIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    totalPrice: totalPrice,
    user: user.id,
  });
  order = await order.save();
  await OrderItem.updateMany({ user: user.id }, { isPlaced: true });
  if (!order) return res.status(400).send("the order cannot be created!");
  res.send(order);
};
export const removeCartItem = async (req, res) => {
  const order = await OrderItem.findOneAndDelete(
    {_id:req.params.id},
    { new: true }
  );

  if (!order)
    return res.status(400).json({ message: "Error while removing this item!" });

  res.status(200).json(order);
};
export const updateOrder = async (req, res) => {
  try {
  const user = req.user;
  console.log(user,'user')
    if (user?.role !== 'Admin') {
      return res.status(401).json({ message: "Not allowed to perform this action!" });

    }
    const order = await Order.findByIdAndUpdate(
      { _id: req.body.id},
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (!order)
      return res.status(400).json({ message: "the order cannot be updated!" });

    res.status(200).json(order);
 
} catch (error) {
  console.error(error);
  res.status(500).json({ success: false, message: "Server Error" });
}
};

export const getAllUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
      const orders = await Order.aggregate([
        {
          $match: { user: mongoose.Types.ObjectId(userId) }, // Match orders for the user
        },
        {
          $lookup: {
            from: "orderitems", // Join with the OrderItem collection
            localField: "productsList", // Field in Order that stores the OrderItem references
            foreignField: "_id", // Field in OrderItem that we join on
            as: "productsList", // Output the joined data as productsList
          },
        },
        {
          $unwind: "$productsList", // Deconstruct the productsList array
        },
        {
          $match: { "productsList.isPlaced": true }, // Filter for OrderItems with isPlaced true
        },
        {
          $lookup: {
            from: "products", // Join with the Product collection
            localField: "productsList.product", // Field in OrderItem that stores Product references
            foreignField: "_id", // Field in Product that we join on
            as: "productsList.productDetails", // Output the joined product data
          },
        },
        {
          $unwind: "$productsList.productDetails", // Deconstruct the productDetails array
        },
        {
          $group: {
            _id: "$_id", // Group back to orders
            productsList: { $push: "$productsList" }, // Rebuild the productsList array with product details
            shippingAddress1: { $first: "$shippingAddress1" },
            shippingAddress2: { $first: "$shippingAddress2" },
            city: { $first: "$city" },
            zip: { $first: "$zip" },
            country: { $first: "$country" },
            phone: { $first: "$phone" },
            status: { $first: "$status" },
            totalPrice: { $first: "$totalPrice" },
            user: { $first: "$user" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
        {
          $sort: { createdAt: -1 }, // Sort the results by createdAt (most recent orders first)
        },
       
      ]);
    res.status(200).json(orders);

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments(); 
      const orders = await Order.aggregate([
        {
          $lookup: {
            from: "orderitems", // Join with the OrderItem collection
            localField: "productsList", // Field in Order that stores the OrderItem references
            foreignField: "_id", // Field in OrderItem that we join on
            as: "productsList", // Output the joined data as productsList
          },
        },
        {
          $unwind: "$productsList", // Deconstruct the productsList array
        },
        {
          $match: { "productsList.isPlaced": true }, // Filter for OrderItems with isPlaced true
        },
        {
          $lookup: {
            from: "products", // Join with the Product collection
            localField: "productsList.product", // Field in OrderItem that stores Product references
            foreignField: "_id", // Field in Product that we join on
            as: "productsList.productDetails", // Output the joined product data
          },
        },
        {
          $unwind: "$productsList.productDetails", // Deconstruct the productDetails array
        },
        {
          $lookup: {
            from: "users", // Join with the User collection
            localField: "user", // Field in Order that stores User reference
            foreignField: "_id", // Field in User that we join on
            as: "userDetails", // Output the joined user data
          },
        },
        {
          $unwind: "$userDetails", // Deconstruct the userDetails array
        },
        {
          $group: {
            _id: "$_id", // Group back to orders
            productsList: { $push: "$productsList" }, // Rebuild the productsList array with product details
            shippingAddress1: { $first: "$shippingAddress1" },
            shippingAddress2: { $first: "$shippingAddress2" },
            city: { $first: "$city" },
            zip: { $first: "$zip" },
            country: { $first: "$country" },
            phone: { $first: "$phone" },
            status: { $first: "$status" },
            totalPrice: { $first: "$totalPrice" },
            userDetails: { $first: "$userDetails" },
            user: { $first: "$user" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
        {
          $sort: { createdAt: -1 }, // Sort the results by createdAt (most recent orders first)
        },
        {
          $skip: skip, // Skip the necessary number of documents for pagination
        },
        {
          $limit: limit, // Limit the results to the page size
        }
      ]);
    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
export const getTotalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.status(200).json({ totalsales: totalSales.pop().totalsales });
};
export const getOrdersCount = async (req, res) => {
  const orderCount = await Order.countDocuments({});
  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.status(200).json({
    orderCount: orderCount,
  });
};
export const addToCart = async (req, res) => {
  const { product, quantity } = req.body;
  const user = req.user;
  const orderItem = await OrderItem.create({
    product,
    quantity,
    user: user.id,
  });
  if (!orderItem) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(orderItem);
};
export const getAllCartItem = async (req, res) => {
  const user = req.user;
  const orderItems = await OrderItem.find({
    user: user.id,
    isPlaced: false,
  }).populate("product");
  if (!orderItems) {
    res.status(500).json({ success: false });
  }
  res.status(200).json(orderItems);
};
