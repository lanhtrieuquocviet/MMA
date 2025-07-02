const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/add-order", orderController.orderProduct);
router.delete("/delete-order/:id", orderController.deleteOrder);
router.get("/get-all-order", orderController.getAllOrders);
router.get("/get-orders-by-user/:userId", orderController.getOrdersByUserId);
router.get("/get-order-by-id/:orderId", orderController.getOrderById);
module.exports = router;
