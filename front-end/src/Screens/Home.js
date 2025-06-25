import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Carousel from "react-native-reanimated-carousel";
import { colors } from "../constants";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ShoppingCartIcon } from "react-native-heroicons/outline";
import Loader from "../Components/Loader";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/orebiSlices";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "react-native-axios";
import { Picker } from "@react-native-picker/picker";
import Footer from "../Components/Footer";

const { width } = Dimensions.get("window");

const bannerImages = [
  "https://hanoicomputercdn.com/media/banner/21_Maye7966c16072a2c6a95b86477a3a57074.jpg",
  "https://shoptaycam.com/wp-content/uploads/2018/06/banner-shop-2.jpg",
  "https://shoptaycam.com/wp-content/uploads/2018/06/banner-shop-4-1024x332.jpg",
];

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchProducts = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            "http://localhost:9999/api/product/get-all-product",
            {
              params: {
                brand: selectedBrand || undefined,
                name: debouncedSearchTerm || undefined,
              },
            }
          );

          // Lọc các sản phẩm có trạng thái "active"
          const activeProducts = response.data.data.filter(
            (product) => product.status === "active"
          );

          setProducts(activeProducts); // Chỉ hiển thị sản phẩm "active"
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      };

      const fetchBrands = async () => {
        try {
          const response = await axios.get(
            "http://localhost:9999/api/product/get-all-brand"
          );
          setBrands(["All Brands", ...response.data.data]);
        } catch (error) {
          console.error("Error fetching brands:", error);
        }
      };

      const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem("authToken");
        setIsLoggedIn(!!token);
      };

      fetchProducts();
      fetchBrands();
      checkLoginStatus();
    }, [selectedBrand, debouncedSearchTerm])
  );

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand === "All Brands" ? "" : brand);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setIsLoggedIn(false);
      Alert.alert("Logout Success", "You have been logged out.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const RenderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productView}
      onPress={() =>
        navigation.navigate("ProductDetails", { productId: item._id })
      }
    >
      <Image source={{ uri: item.image }} style={styles.img} />
      <View style={styles.textView}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceCartContainer}>
          <Text style={styles.price}>
            {item.price.toLocaleString("vi-VN")} VNĐ
          </Text>

          <TouchableOpacity
            onPress={() => {
              dispatch(
                addToCart({
                  productId: item._id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: 1,
                })
              );
              Toast.show({
                type: "success",
                text1: `${item.name} added to cart successfully`,
              });
            }}
            style={styles.cartButton}
          >
            <ShoppingCartIcon size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <Loader title="Loading Products..." />
        ) : (
          <FlatList
            data={products}
            contentContainerStyle={styles.container}
            keyExtractor={(item) => item._id.toString()}
            renderItem={RenderItem}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 2000);
            }}
            numColumns={2}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View>
                <Carousel
                  loop
                  width={width}
                  height={150}
                  style={styles.carouselContainer}
                  autoPlay={true}
                  data={bannerImages}
                  scrollAnimationDuration={1000}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item }}
                      style={styles.carouselImage}
                    />
                  )}
                />
                <View style={styles.filterContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                  />
                  <View style={styles.dropdownContainer}>
                    <Picker
                      selectedValue={
                        selectedBrand === ""
                          ? "Tất cả thương hiệu"
                          : selectedBrand
                      }
                      onValueChange={handleBrandChange}
                      style={styles.dropdown}
                      mode="dropdown"
                    >
                      <Picker.Item label="Tất cả thương hiệu" value="" />
                      {brands
                        .filter((brand) => brand !== "All Brands") // Loại bỏ giá trị cũ nếu có
                        .map((brand) => (
                          <Picker.Item
                            key={brand}
                            label={brand}
                            value={brand}
                          />
                        ))}
                    </Picker>
                  </View>
                </View>
                {products.length === 0 && (
                  <View style={styles.noProductsContainer}>
                    <Text style={styles.noProductsText}>No products found</Text>
                  </View>
                )}
              </View>
            }
            ListFooterComponent={<Footer />} // Hiển thị footer khi cuộn hết danh sách
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 100,
    paddingHorizontal: 8, // Thêm padding ngang
  },
  carouselContainer: {
    marginBottom: 10,
  },
  carouselImage: {
    width: "95%",
    height: 150, // Giảm chiều cao Carousel
    resizeMode: "cover",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center", // Căn giữa các thành phần
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  dropdownContainer: {
    width: 140,
  },
  productView: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    maxWidth: width / 2 - 16, // Đảm bảo mỗi sản phẩm chiếm 50% chiều rộng
  },
  img: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
  },
  textView: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textBlack,
    marginBottom: 5,
  },
  priceCartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.designColor,
  },
  cartButton: {
    backgroundColor: "#ff6347",
    padding: 5,
    borderRadius: 5,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: colors.textGray,
  },
});

export default Home;
