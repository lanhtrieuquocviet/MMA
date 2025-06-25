import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // Hàm kiểm tra dữ liệu
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:9999/api/user/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok && data.status === "OK") {
        const { id, access_token, isAdmin } = data;
        dispatch(setUser({ userId: id, token: access_token, isAdmin }));
        await AsyncStorage.setItem("token", access_token);

        Alert.alert("Đăng nhập thành công", data.message);
        navigation.navigate("Home");
      } else {
        Alert.alert("Đăng nhập thất bại", data.message);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi, vui lòng thử lại");
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Nút quay về trang chủ */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.homeButtonText}>⬅ Trang chủ</Text>
      </TouchableOpacity>

      <Text style={styles.headerText}>Đăng nhập</Text>

      {/* Ô nhập tên đăng nhập */}
      <TextInput
        style={[styles.input, errors.username && styles.inputError]}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setErrors({ ...errors, username: "" });
        }}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username}</Text>
      )}

      {/* Ô nhập mật khẩu */}
      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors({ ...errors, password: "" });
        }}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      {/* Quên mật khẩu */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Nút đăng nhập */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Đăng ký */}
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.footerText}>Chưa có tài khoản? </Text>
        <Text style={styles.linkText}>Đăng ký</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  homeButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: "#007bff",
    fontSize: 14,
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 16,
    color: "#333",
  },
  linkText: {
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default Login;
