const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const User = require("../models/UserModel");

const createUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      username,
      fullname,
      email,
      password,
      confirmPassword,
      phone,
      address,
    } = req.body;

    // if (!username || !fullname || !email || !password || !confirmPassword || !phone || !address) {
    //     const error = new Error('All fields are required');
    //     error.statusCode = 400;
    //     return next(error);
    // }

    // if (password !== confirmPassword) {
    //     const error = new Error('Password and confirmPassword do not match');
    //     error.statusCode = 400;
    //     return next(error);
    // }

    const response = await UserService.createUser(req.body);
    return res.status(201).json(response);
  } catch (error) {
    next(error); // Đẩy lỗi sang middleware
  }
};

const loginUser = async (req, res, next) => {
  try {
    console.log("Received Login Request:", req.body);
    const { username, password } = req.body;
    // const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    // const isCheckEmail = reg.test(email)
    if (!username || !password) {
      return res.status(400).json({
        status: "ERR",
        message: "The Username or Password is required",
      });
    }
    // else if (!isCheckEmail) {
    //     return res.status(200).json({
    //         status: 'ERR',
    //         message: 'The input is email'
    //     })
    // }
    // console.log('isCheckEmail', isCheckEmail)
    const response = await UserService.loginUser(req.body, next);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    console.log("userId", userId);
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    console.log("userId", userId);
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await UserService.getAllUsers();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("userId", userId);
    if (!userId) {
      return res.status(404).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.headers.token.split(" ")[1];
    if (!token) {
      return res.status(404).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const response = await UserService.forgotPassword(email);
    console.log("Forgot Password Response:", response); // Kiểm tra dữ liệu
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Kiểm tra xem có đủ thông tin không
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Token, new password, and confirm password are required",
      });
    }

    // Kiểm tra mật khẩu nhập lại có khớp không
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "ERR",
        message: "New password and confirm password do not match",
      });
    }

    // Gọi Service xử lý đặt lại mật khẩu
    const response = await UserService.resetPassword(token, newPassword);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const changePasswordController = async (req, res) => {
  try {
    const { username, oldPassword, newPassword, confirmPassword } = req.body;

    // Gọi Service để xử lý logic
    const response = await UserService.changePassword(
      username,
      oldPassword,
      newPassword,
      confirmPassword
    );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const response = await UserService.getUserProfile(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message,
    });
  }
};
const editProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullname, email, phone, address } = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    // Gọi service để cập nhật thông tin
    const response = await UserService.editProfile(userId, {
      fullname,
      email,
      phone,
      address,
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getDetailsUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePasswordController,
  getUserProfile,
  editProfile,
};
