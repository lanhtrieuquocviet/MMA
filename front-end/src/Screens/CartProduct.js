import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { colors } from "../constants";
import { MinusIcon, PlusIcon, TrashIcon } from "react-native-heroicons/outline";
import {
  decreaseQuantity,
  deleteProduct,
  increaseQuantity,
} from "../redux/orebiSlices";

const CartProduct = ({ item }) => {
  const dispatch = useDispatch();
  const totalPrice = item.price * item.quantity;

  return (
    <View style={styles.container}>
      {/* Hình ảnh và tên sản phẩm */}
      <View style={styles.productInfo}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>
            Giá: {item.price.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
      </View>

      {/* Nút tăng/giảm số lượng */}
      <View style={styles.quantityContainer}>
        <Pressable
          onPress={() =>
            dispatch(decreaseQuantity({ productId: item.productId }))
          }
          style={styles.quantityButton}
        >
          <MinusIcon size={16} color={colors.textBlack} />
        </Pressable>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Pressable
          onPress={() =>
            dispatch(increaseQuantity({ productId: item.productId }))
          }
          style={styles.quantityButton}
        >
          <PlusIcon size={16} color={colors.textBlack} />
        </Pressable>
      </View>

      {/* Tổng tiền */}
      <Text style={styles.totalPrice}>
        Tổng: {totalPrice.toLocaleString("vi-VN")} VNĐ
      </Text>

      {/* Nút xóa sản phẩm */}
      <Pressable
        onPress={() => dispatch(deleteProduct(item.productId))}
        style={styles.deleteButton}
      >
        <TrashIcon size={20} color={colors.textBlack} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: colors.defaultWhite,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productDetails: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textBlack,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    width: 100,
    paddingVertical: 4,
    alignSelf: "flex-end",
  },
  quantityButton: {
    padding: 6,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textBlack,
    marginHorizontal: 10,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textBlack,
    marginTop: 10,
    textAlign: "right",
  },
  deleteButton: {
    position: "absolute",
    top: -8,
    left: -8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    elevation: 3,
  },
});

export default CartProduct;
