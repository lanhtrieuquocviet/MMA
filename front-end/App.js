import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigation from "./src/navigation/DrawerNavigation";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { colors } from "./src/constants"; // Make sure this exists
import Toast, { BaseToast } from "react-native-toast-message"; // Import Toast components

const RootContent = () => {
  return (
    <NavigationContainer>
      <DrawerNavigation />
    </NavigationContainer>
  );
};

// Custom Toast configuration
const toastConfig = {
  success: (props) => {
    return (
      <BaseToast
        {...props}
        style={{ borderLeftColor: colors.designColor }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "500",
        }}
      />
    );
  },
};

const App = () => {
  return (
    <Provider store={store}>
      <RootContent />
      {/* Toast component to handle showing the toast notifications */}
      <Toast config={toastConfig} position="bottom" visibilityTime={2000} />
    </Provider>
  );
};

export default App;
