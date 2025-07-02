const Product = require("../models/ProductModel");
const mongoose = require("mongoose");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, brand, price, countInStock, description } = newProduct;

    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "OK",
          message: "The name of product is already",
        });
      }
      const createProduct = await Product.create({
        name,
        image,
        brand,
        price,
        countInStock,
        description,
      });
      if (createProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem id có hợp lệ không trước khi truy vấn
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reject({
          statusCode: 400,
          message: "Invalid Product ID format",
        });
      }
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        return reject({ statusCode: 400, message: "Product is not defined" });
      }

      const updateProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem id có hợp lệ không trước khi truy vấn
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reject({
          statusCode: 400,
          message: "Invalid Product ID format",
        });
      }
      const checkProduct = await Product.findOne({
        _id: id,
      });
      console.log("User ID:", id);
      if (checkProduct === null) {
        return reject({ statusCode: 400, message: "Product is not defined" });
      }
      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete Product Success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateStatusProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem id có hợp lệ không trước khi truy vấn
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reject({
          statusCode: 400,
          message: "Invalid Product ID format",
        });
      }
      const checkProduct = await Product.findOne({
        _id: id,
      });
      console.log("User ID:", id);
      if (checkProduct === null) {
        return reject({ statusCode: 400, message: "Product is not defined" });
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { status: "inactive" }, // Cập nhật status thành inactive
        { new: true, runValidators: true }
      );
      // await Product.findByIdAndDelete(id)
      resolve({
        status: "OK",
        message: "Product change status as inactive",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = async (limit = 8, page = 0, brand = "", name = "") => {
  return new Promise(async (resolve, reject) => {
    try {
      const filter = {};

      if (brand) {
        filter.brand = brand;
      }

      if (name) {
        filter.name = { $regex: name, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
      }

      const totalProduct = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .limit(limit)
        .skip(page * limit);

      resolve({
        status: "OK",
        message: "Get all products successfully",
        data: products,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllBrands = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await Product.distinct("brand"); // Không trả về mật khẩu
      resolve({
        status: "OK",
        message: "Get all brand successfully",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem id có hợp lệ không trước khi truy vấn
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reject({
          statusCode: 400,
          message: "Invalid Product ID format",
        });
      }
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The Product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: checkProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
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
