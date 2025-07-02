const OrderService = require("../services/OrderService");

const orderProduct = async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (
      !userId ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "User ID and products are required",
      });
    }

    const response = await OrderService.orderProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const response = await OrderService.getAllOrders();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params;
    if (!orderId) {
      return resolve({
        status: "ERR",
        message: "The orderId is required",
      });
    }

    const response = await OrderService.deleteOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "User ID is required",
      });
    }

    const response = await OrderService.getOrdersByUserId(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "Order ID is required",
      });
    }

    const response = await OrderService.getOrderById(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  orderProduct,
  getAllOrders,
  deleteOrder,
  getOrdersByUserId,
  getOrderById,
};
