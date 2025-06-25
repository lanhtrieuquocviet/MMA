import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import orebiSlices from "./orebiSlices";
import authSlice from "./authSlice"; 
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: 0, 
};

const persistedReducer = persistReducer(persistConfig, orebiSlices);

export const store = configureStore({
  reducer: { orebiSlices: persistedReducer, auth: authSlice },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export const getDispatch = () => store.dispatch;
