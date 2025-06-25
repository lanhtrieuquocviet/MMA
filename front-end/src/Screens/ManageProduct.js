import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.userId);

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const response = await axios.get(
        "http://localhost:9999/api/product/get-all-product",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );
  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  const handleDeleteProduct = async (productId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const response = await axios.delete(
        `http://localhost:9999/api/product/delete-product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "OK") {
        Alert.alert("Thành công", "Xóa sản phẩm thành công!");
        fetchProducts();
      } else {
        Alert.alert("Lỗi", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi xóa sản phẩm.");
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>Giá: {item.price} VNĐ</Text>
        <Text style={styles.productBrand}>Thương hiệu: {item.brand}</Text>
        <Text style={styles.productStock}>
          Số lượng trong kho: {item.countInStock}
        </Text>
        <Text style={styles.productDescription}>
          Mô tả: {truncateDescription(item.description, 50)}{" "}
          {/* Giới hạn 50 ký tự */}
        </Text>
        <Text style={styles.productStatus}>
          Trạng thái:{" "}
          {item.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditProduct", { productId: item._id })
          }
        >
          <Ionicons name="pencil" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item._id)}>
          <Ionicons name="trash" size={24} color="#ff4d4d" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>Trở về trang chủ</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Quản lý sản phẩm</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  productItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  productBrand: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  productStock: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  productStatus: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
});

export default ManageProduct;
