const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderDate: { type: Date, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        products: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String },
            quantity: { type: Number, required: true, min: 1 }
        }],
        totalPrice: { type: Number, required: true, min: 0 }
    }
);

module.exports = mongoose.model("Order", orderSchema);
