const ProductService = require("../services/ProductService");

const createProduct = async (req, res, next) => {
  try {
    const { name, image, brand, price, countInStock, description } = req.body;

    if (!name || !image || !brand || !price || !countInStock || !description) {
      return res.status(400).json({
        status: "ERR",
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    const response = await ProductService.createProduct(req.body);

    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    console.log("productId", productId);
    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    console.log("userId", productId);
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};
const updateStatusProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    console.log("userId", productId);
    const response = await ProductService.updateStatusProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};
const getDetailsProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log("userId", productId);
    if (!productId) {
      return res.status(404).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};
const getAllProduct = async (req, res) => {
  try {
    const { limit, page, brand, name } = req.query;

    const response = await ProductService.getAllProduct(
      Number(limit),
      Number(page),
      brand || "", // Nếu không có brand, truyền chuỗi rỗng
      name || "" // Nếu không có name, truyền chuỗi rỗng
    );

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const response = await ProductService.getAllBrands();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};
module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  getAllBrands,
  updateStatusProduct,
};
