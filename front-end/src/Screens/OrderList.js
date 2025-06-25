import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

const OrderList = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/order/get-orders-by-user/${userId}`
        );
        if (response.data.status === "OK") {
          setOrders(response.data.data);
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.loginPromptText}>
          Vui lòng đăng nhập để xem đơn hàng
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noOrdersText}>Không có đơn hàng nào</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeftIcon size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Danh sách đơn hàng</Text>
      </View>

      <ScrollView>
        {orders.map((order) => (
          <TouchableOpacity
            key={order._id}
            style={styles.orderItem}
            onPress={() =>
              navigation.navigate("OrderDetail", { orderId: order._id })
            }
          >
            <Text style={styles.orderId}>Mã đơn hàng: {order._id}</Text>
            <Text style={styles.orderDate}>
              Ngày đặt hàng: {new Date(order.orderDate).toLocaleDateString()}
            </Text>
            <Text style={styles.totalPrice}>
              Tổng tiền: {order.totalPrice.toLocaleString("vi-VN")} VNĐ
            </Text>
            <Text style={styles.productCount}>
              Số lượng sản phẩm: {order.products.length}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    color: "#e74c3c",
  },
  productCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  loginPromptText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  loginText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  noOrdersText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default OrderList;
