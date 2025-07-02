const User = require("../models/UserModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
dotenv.config();

const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const {
      username,
      fullname,
      email,
      password,
      confirmPassword,
      phone,
      address,
    } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        return reject({
          statusCode: 400,
          message: "The email is already in use",
        });
      }
      // Kiểm tra password và confirmPassword
      if (password !== confirmPassword) {
        return reject({
          statusCode: 400,
          message: "Password and Confirm Password must match",
        });
      }
      const createUser = await User.create({
        username,
        fullname,
        email,
        password,
        phone,
        address,
      });
      if (createUser) {
        resolve({
          status: "OK",
          message: "Create user success",
          data: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { username, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        username: username,
      });
      if (checkUser === null) {
        return reject({
          statusCode: 400,
          message: "The Username is not defined",
        });
      }

      if (checkUser.status === "inactive") {
        return reject({ statusCode: 401, message: "The User not ative" });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      // console.log(comparePassword)
      if (!comparePassword) {
        return reject({
          statusCode: 400,
          message: "The Password is incorrect",
        });
      }
      const access_token = genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      const refresh_token = genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      // console.log('access_token', access_token)
      resolve({
        status: "OK",
        message: "SUCCESS",
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem id có hợp lệ không trước khi truy vấn
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reject({ statusCode: 400, message: "Invalid User ID format" });
      }
      const checkUser = await User.findOne({
        _id: id,
      });
      // console.log("User ID:", id);
      // const allUsers = await User.find();
      // console.log("All Users:", allUsers);

      // console.log('checkUser', checkUser)
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
      // console.log("UpdateUser", updateUser)

      resolve({
        status: 200,
        message: "User updated success",
        data: {
          _id: updateUser._id,
          username: updateUser.username,
          fullname: updateUser.fullname,
          email: updateUser.email,
          phone: updateUser.phone,
          address: updateUser.address,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem id có hợp lệ không trước khi truy vấn
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reject({ statusCode: 400, message: "Invalid User ID format" });
      }
      const checkUser = await User.findOne({
        _id: id,
      });
      console.log("User ID:", id);
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete User Success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUsers = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({}, { password: 0 }); // Không trả về mật khẩu
      resolve({
        status: "OK",
        message: "Get all users successfully",
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem id có hợp lệ không trước khi truy vấn
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return reject({ statusCode: 400, message: "Invalid User ID format" });
      }
      const checkUser = await User.findOne({
        _id: id,
      });
      console.log("checkUser", checkUser);
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }

      resolve({
        status: 200,
        message: "Get user details success",
        data: checkUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const forgotPassword = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        resolve({
          status: "ERR",
          message: "User not found",
        });
        return;
      }

      // Tạo resetToken bằng JWT (KHÔNG LƯU vào DB)
      const resetToken = jwt.sign(
        { email: user.email },
        process.env.RESET_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const resetLink = `http://localhost:8888/api/user/reset-password?token=${resetToken}`;
      console.log(`Reset link: ${resetLink}`); // Log link để test
      console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
      // Gửi email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        to: email,
        subject: "Password Reset Request",
        html: `<p>Click the link below to reset your password:</p>
                       <p><a href="${resetLink}">Reset Password</a></p>`,
      });

      resolve({
        status: "OK",
        message: "Password reset link sent to your email",
        resetToken,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const resetPassword = (token, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Giải mã token để lấy email
      console.log(token);
      const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
      const user = await User.findOne({ email: decoded.email });
      console.log(user);
      if (!user) {
        return resolve({
          status: "ERR",
          message: "Invalid token or user not found",
        });
      }

      // Mã hóa mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Cập nhật mật khẩu mới
      user.password = hashedPassword;
      await user.save();

      return resolve({
        status: "OK",
        message: "Password reset successfully",
      });
    } catch (error) {
      return reject({
        status: "ERR",
        message: "Invalid or expired token",
      });
    }
  });
};
const changePassword = (
  username,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Received data:", {
        username,
        oldPassword,
        newPassword,
        confirmPassword,
      });

      // Kiểm tra thông tin đầu vào
      if (!username || !oldPassword || !newPassword || !confirmPassword) {
        return resolve({
          status: "ERR",
          message: "Please provide all required fields",
        });
      }
      // Tìm kiếm user trong DB
      const user = await User.findOne({ username });
      console.log("user", user);
      if (!user) {
        return resolve({
          status: "ERR",
          message: "User not found",
        });
      }

      if (newPassword !== confirmPassword) {
        return resolve({
          status: "ERR",
          message: "New password and confirm password do not match",
        });
      }

      // Kiểm tra mật khẩu cũ
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        return resolve({
          status: "ERR",
          message: "Old password is incorrect",
        });
      }

      // Kiểm tra nếu mật khẩu mới trùng mật khẩu cũ
      const isNewPasswordSameAsOld = await bcrypt.compare(
        newPassword,
        user.password
      );
      if (isNewPasswordSameAsOld) {
        return resolve({
          status: "ERR",
          message: "New password must be different from the old password",
        });
      }

      // Mã hóa mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;

      // Lưu vào DB
      await user.save();

      return resolve({
        status: "OK",
        message: "Password updated successfully",
      });
    } catch (error) {
      return reject({
        status: "ERR",
        message: "Internal server error",
      });
    }
  });
};
const getUserProfile = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem userId có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return reject({ statusCode: 400, message: "Invalid User ID format" });
      }

      // Tìm kiếm user trong database
      const user = await User.findOne({ _id: userId }, { password: 0 }); // Không trả về mật khẩu

      if (!user) {
        return resolve({
          status: "ERR",
          message: "User not found",
        });
      }

      // Trả về thông tin user
      resolve({
        status: "OK",
        message: "Get user profile successfully",
        data: user,
      });
    } catch (error) {
      reject(error);
    }
  });
};
const editProfile = async (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem userId có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return reject({ statusCode: 400, message: "Invalid User ID format" });
      }

      // Kiểm tra xem người dùng có tồn tại không
      const user = await User.findById(userId);
      if (!user) {
        return reject({ statusCode: 404, message: "User not found" });
      }

      // Cập nhật thông tin người dùng
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          fullname: data.fullname,
          email: data.email,
          phone: data.phone,
          address: data.address,
        },
        { new: true } // Trả về bản ghi đã được cập nhật
      );

      resolve({
        status: "OK",
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getDetailsUser,
  forgotPassword,
  resetPassword,
  changePassword,
  getUserProfile,
  editProfile,
};
