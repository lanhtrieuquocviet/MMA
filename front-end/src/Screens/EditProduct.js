import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Picker,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const EditProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const response = await axios.get(
        `http://localhost:9999/api/product/details-product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const product = response.data.data;
      setName(product.name);
      setPrice(product.price.toString());
      setBrand(product.brand);
      setCountInStock(product.countInStock.toString());
      setDescription(product.description);
      setStatus(product.status);
      setImage(product.image);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!name || !price || !brand || !countInStock || !description || !image) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const data = {
        name,
        price: Number(price),
        brand,
        countInStock: Number(countInStock),
        description,
        status,
        image,
      };

      const response = await axios.put(
        `http://localhost:9999/api/product/update-product/${productId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "OK") {
        Alert.alert("Thành công", "Cập nhật sản phẩm thành công!");
        navigation.navigate("ManageProduct");
      } else {
        Alert.alert("Lỗi", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message
      );
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>Trở lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Chỉnh sửa sản phẩm</Text>
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
        placeholder="URL hình ảnh"
        value={image}
        onChangeText={setImage}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Trạng thái:</Text>
        <Picker
          selectedValue={status}
          style={styles.picker}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item label="Hoạt động" value="active" />
          <Picker.Item label="Không hoạt động" value="inactive" />
        </Picker>
      </View>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateProduct}
        disabled={loading}
      >
        <Text style={styles.updateButtonText}>
          {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
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
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  updateButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProduct;
