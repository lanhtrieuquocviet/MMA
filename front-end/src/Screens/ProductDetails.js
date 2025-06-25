import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import { useRoute, useNavigation } from "@react-navigation/native";
import { colors } from "../constants";
import { ArrowRightIcon, ArrowLeftIcon } from "react-native-heroicons/outline";
import { addToCart } from "../redux/orebiSlices";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import axios from "axios";

const { height, width } = Dimensions.get("window");

const ProductDetails = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/product/details-product/${productId}`
        );
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loaderText}>Đang tải...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.loaderText}>Sản phẩm không tồn tại</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Pressable
          onPress={() => navigation.navigate("Home")}
          style={styles.backButton}
        >
          <ArrowLeftIcon size={24} color={colors.textBlack} />
        </Pressable>

        <View style={styles.imgView}>
          <Image source={{ uri: product.image }} style={styles.img} />
        </View>

        <View style={styles.detailsView}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>Thương hiệu: {product.brand}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomMenu}>
        <Text style={styles.productPrice}>
          {new Intl.NumberFormat("vi-VN").format(product.price)} VNĐ
        </Text>
        <Pressable
          onPress={() => {
            dispatch(addToCart({ ...product, quantity: 1 }));
            Toast.show({
              type: "success",
              text1: `${product.name} đã được thêm vào giỏ hàng`,
            });
          }}
          style={styles.addToCartButton}
        >
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
          <ArrowRightIcon size={16} color={colors.textBlack} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
  },
  imgView: {
    width: width,
    height: height / 2.5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  img: {
    width: "90%",
    height: "100%",
    resizeMode: "contain",
  },
  detailsView: {
    padding: 20,
    backgroundColor: "white",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textBlack,
    marginBottom: 10,
  },
  productBrand: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.buttonColor,
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: colors.textGray,
    marginBottom: 15,
    lineHeight: 22,
    textAlign: "justify",
  },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "white",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.designColor,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.designColor,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
    color: colors.textBlack,
  },
  loaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductDetails;
