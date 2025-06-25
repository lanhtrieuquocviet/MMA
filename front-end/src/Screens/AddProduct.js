import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Thêm icon

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // Thêm state cho image
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleAddProduct = async () => {
    if (!name || !price || !brand || !countInStock || !description || !image) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Lỗi", "Token không tồn tại. Vui lòng đăng nhập lại.");
        return;
      }

      // Gửi yêu cầu POST đến server
      const response = await axios.post(
        "http://localhost:9999/api/product/create-product",
        {
          name,
          price: Number(price), // Chuyển đổi price thành số
          brand,
          countInStock: Number(countInStock), // Chuyển đổi countInStock thành số
          description,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );

      // Xử lý phản hồi từ server
      if (response.data.status === "OK") {
        Alert.alert("Thành công", "Thêm sản phẩm thành công!");
        navigation.goBack(); // Quay lại trang trước đó
      } else {
        Alert.alert(
          "Lỗi",
          response.data.message || "Đã xảy ra lỗi không xác định."
        );
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);

      // Hiển thị thông báo lỗi chi tiết từ server
      if (error.response) {
        console.error("Phản hồi từ server:", error.response.data);
        Alert.alert(
          "Lỗi",
          error.response.data.message || "Đã xảy ra lỗi khi thêm sản phẩm."
        );
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
        Alert.alert(
          "Lỗi",
          "Không thể kết nối đến server. Vui lòng thử lại sau."
        );
      } else {
        console.error("Lỗi khi thiết lập yêu cầu:", error.message);
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi yêu cầu.");
      }
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <View style={styles.container}>
      {/* Nút trở về trang ManageProduct */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>Trở lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Thêm sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Thương hiệu"
        value={brand}
        onChangeText={setBrand}
      />
      <TextInput
        style={styles.input}
        placeholder="Số lượng trong kho"
        value={countInStock}
        onChangeText={setCountInStock}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Hình ảnh (URL)"
        value={image}
        onChangeText={setImage}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddProduct}
        disabled={loading}
      >
        <Text style={styles.addButtonText}>
          {loading ? "Đang thêm..." : "Thêm sản phẩm"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddProduct;
