const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");

const orderProduct = (orderData) => {
  return new Promise(async (resolve, reject) => {
    const { userId, products } = orderData;

    try {
      if (!userId || !Array.isArray(products) || products.length === 0) {
        return resolve({
          status: "ERROR",
          message: "User ID and products are required",
        });
      }

      const customer = await User.findById(userId);
      if (!customer) {
        return resolve({
          status: "ERROR",
          message: `User not found: ${userId}`,
        });
      }

      const productIds = products.map((item) => item.productId);
      const productList = await Product.find({ _id: { $in: productIds } });

      if (productList.length !== products.length) {
        return resolve({
          status: "ERROR",
          message: "One or more products not found",
        });
      }

      let totalPrice = 0;
      const bulkUpdateOperations = [];

      for (let item of products) {
        const product = await Product.findById(item.productId);

        if (!product) {
          return resolve({
            status: "ERROR",
            message: `Product not found: ${item.productId}`,
          });
        }

        if (product.countInStock < item.quantity) {
          return resolve({
            status: "ERROR",
            message: `Stock is insufficient for product: ${product.name}`,
          });
        }

        totalPrice += product.price * item.quantity;

        bulkUpdateOperations.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $inc: { countInStock: -item.quantity } },
          },
        });
      }

      const newOrder = await Order.create({
        userId,
        products,
        totalPrice,
      });

      if (newOrder) {
        await Product.bulkWrite(bulkUpdateOperations);
        resolve({
          status: 201,
          message: "Order created successfully",
          data: {
            newOrder,
          },
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const orders = await Order.find().populate(
        "products.productId",
        "name status"
      );

      if (!orders || orders.length === 0) {
        return resolve({
          status: "ERROR",
          message: "No orders found",
        });
      }

      const updatedOrders = orders.map((order) => ({
        orderId: order._id,
        orderDate: order.orderDate,
        userId: order.userId,
        totalPrice: order.totalPrice,
        products: order.products.map((item) => ({
          productId: item.productId?._id,
          name: item.productId?.name,
          quantity: item.quantity,
          status: item.productId?.status || "active",
        })),
      }));

      resolve({
        status: "OK",
        message: "Get all orders successfully",
        data: updatedOrders,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteOrder = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(orderId).populate(
        "products.productId",
        "status"
      );

      if (!order) {
        return resolve({
          status: "ERROR",
          message: "Order not found",
        });
      }

      const bulkUpdateOperations = order.products
        .filter((item) => item.productId.status === "active")
        .map((item) => ({
          updateOne: {
            filter: { _id: item.productId._id },
            update: { $inc: { stock: item.quantity } },
          },
        }));

      if (bulkUpdateOperations.length > 0) {
        await Product.bulkWrite(bulkUpdateOperations);
      }

      const delDoc = await Order.findByIdAndDelete(orderId);

      resolve({
        status: "OK",
        message: "Delete order successfully",
        data: delDoc,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getOrdersByUserId = async (userId) => {
  try {
    const orders = await Order.find({ userId }).populate("products.productId");
    return {
      status: "OK",
      message: "Success",
      data: orders,
    };
  } catch (e) {
    throw new Error(e);
  }
};
const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate("products.productId");
    if (!order) {
      return {
        status: "ERROR",
        message: "Order not found",
      };
    }
    return {
      status: "OK",
      message: "Success",
      data: order,
    };
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  orderProduct,
  getAllOrders,
  deleteOrder,
  getOrdersByUserId,
  getOrderById,
};
