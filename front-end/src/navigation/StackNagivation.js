import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Screens/Home";
import Cart from "../Screens/Cart";
import ProductDetails from "../Screens/ProductDetails";
import Checkout from "../Screens/Checkout";
import Login from "../Screens/Login";
import Signup from "../Screens/Signup";
import ChangePassword from "../Screens/ChangePassword";
import ForgotPassword from "../Screens/ForgotPassword";
import ResetPassword from "../Screens/ResetPassword";
import OrderDetail from "../Screens/OrderDetail";
import OrderList from "../Screens/OrderList"; // Thêm màn hình OrderList
import UserProfile from "../Screens/UserProfile";
import ManageProduct from "../Screens/ManageProduct";
import AddProduct from "../Screens/AddProduct";
import EditProduct from "../Screens/EditProduct";

const RootStack = createNativeStackNavigator();
const StackNagivation = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Cart"
        component={Cart}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Checkout"
        component={Checkout}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="OrderList"
        component={OrderList}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ManageProduct"
        component={ManageProduct}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

export default StackNagivation;
