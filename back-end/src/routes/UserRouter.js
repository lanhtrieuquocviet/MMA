const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.put("/update-user/:id", userController.updateUser);
router.get("/getAll", authMiddleware, userController.getAllUsers);
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
router.get(
  "/get-details/:id",
  authUserMiddleware,
  userController.getDetailsUser
);
router.post("/refresh-token", userController.refreshToken);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/change-password", userController.changePasswordController);
router.get(
  "/get-profile/:id",
  authUserMiddleware,
  userController.getUserProfile
);
router.put("/edit-profile/:id", authUserMiddleware, userController.editProfile);

module.exports = router;
