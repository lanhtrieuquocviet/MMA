import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Header from "../Components/Header";
import { useSelector, useDispatch } from "react-redux";
import CartProduct from "../Screens/CartProduct";
import { colors } from "../constants";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from "axios";
import { resetCart } from "../redux/orebiSlices";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.orebiSlices);
  const userId = useSelector((state) => state.auth.userId);

  console.log("User ID in Cart:", userId);

  const subtotal = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal;

  const handleCheckout = async () => {
    console.log("User ID:", userId);
    if (!userId) {
      return Toast.show({
        type: "error",
        text1: "Vui lòng đăng nhập để thanh toán",
        text1Style: { color: "red" },
        text2: "Chức năng đăng nhập đang được hoàn thiện...",
        text2Style: { color: "black" },
      });
    }

    try {
      const orderData = {
        userId: userId,
        products: products.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
        })),
      };

      console.log("Order Data:", orderData);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return Toast.show({
          type: "error",
          text1: "Vui lòng đăng nhập lại",
          text1Style: { color: "red" },
        });
      }

      const response = await axios.post(
        "http://localhost:9999/api/order/add-order",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 201) {
        Toast.show({
          type: "success",
          text1: "Đặt hàng thành công!",
          text1Style: { color: "green" },
        });

        navigation.navigate("Home");

        dispatch(resetCart());
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Checkout Error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Lỗi đặt hàng",
        text2: error.response?.data?.message || "Đã có lỗi xảy ra",
        text2Style: { color: "black" },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {products.length > 0 ? (
          <>
            <View style={styles.productList}>
              {products.map((item) => (
                <CartProduct key={item.productId} item={item} />
              ))}
            </View>
            <View style={styles.summaryContainer}>
              <View style={styles.row}>
                <Text style={styles.text}>Tạm tính</Text>
                <Text style={styles.subtotal}>
                  {subtotal.toLocaleString("vi-VN")} VNĐ
                </Text>
              </View>
              <View style={[styles.row, styles.totalRow]}>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.total}>
                  {total.toLocaleString("vi-VN")} VNĐ
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleCheckout}
                style={styles.checkoutButton}
              >
                <Text style={styles.checkoutText}>THANH TOÁN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.continueButton}
              >
                <Text style={styles.continueText}>Tiếp tục mua sắm</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Quay lại mua sắm</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultWhite,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  productList: {
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalRow: {
    marginVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
  },
  text: {
    fontSize: 14,
    color: colors.textBlack,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textBlack,
  },
  discount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e74c3c",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textBlack,
  },
  total: {
    fontSize: 18,
    fontWeight: "700",
    color: "#27ae60",
  },
  checkoutButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  checkoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  continueButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#27ae60",
  },
  continueText: {
    color: "#27ae60",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textBlack,
    fontWeight: "700",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  backButtonText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default Cart;
