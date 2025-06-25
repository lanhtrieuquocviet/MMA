import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Thêm icon

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [editedData, setEditedData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
  }); // Dữ liệu chỉnh sửa
  const userId = useSelector((state) => state.auth.userId);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!userId) {
          console.error("User ID is not available");
          return;
        }

        // Lấy token từ AsyncStorage
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("Token is not available");
          return;
        }

        const response = await axios.get(
          `http://localhost:9999/api/user/get-profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào headers
            },
          }
        );

        setUserData(response.data.data);
        setEditedData({
          fullname: response.data.data.fullname,
          email: response.data.data.email,
          phone: response.data.data.phone,
          address: response.data.data.address,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Hàm xử lý chỉnh sửa thông tin
  const handleEditProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const response = await axios.put(
        `http://localhost:9999/api/user/edit-profile/${userId}`,
        editedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "OK") {
        setUserData(response.data.data); // Cập nhật dữ liệu mới
        setIsEditing(false); // Tắt chế độ chỉnh sửa
        Alert.alert("Thành công", "Cập nhật thông tin thành công!");
      } else {
        Alert.alert("Lỗi", response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật thông tin.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Không tìm thấy thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Nút trở lại */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Trở lại</Text>
        </TouchableOpacity>

        {/* Tiêu đề */}
        <Text style={styles.title}>Thông tin cá nhân</Text>

        {/* Thông tin người dùng */}
        <View style={styles.card}>
          {/* Fullname */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Tên đầy đủ:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData.fullname}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, fullname: text })
                }
              />
            ) : (
              <Text style={styles.value}>{userData.fullname}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData.email}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, email: text })
                }
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.value}>{userData.email}</Text>
            )}
          </View>

          {/* Phone */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Số điện thoại:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData.phone}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, phone: text })
                }
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{userData.phone}</Text>
            )}
          </View>

          {/* Address */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Địa chỉ:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData.address}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, address: text })
                }
              />
            ) : (
              <Text style={styles.value}>{userData.address}</Text>
            )}
          </View>
        </View>

        {/* Nút chỉnh sửa hoặc lưu */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (isEditing) {
              handleEditProfile(); // Lưu thông tin
            } else {
              setIsEditing(true); // Bật chế độ chỉnh sửa
            }
          }}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Lưu thông tin" : "Chỉnh sửa thông tin"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  editButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfile;
