import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: []
};

// Redux slice for cart management
export const orebiSlice = createSlice({
    name: 'orebiSlices',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingProduct = state.products.find(
                (item) => item.productId === action.payload.productId
            );
            if (existingProduct) {
                // Increase quantity of existing product
                existingProduct.quantity += action.payload.quantity || 1; // Default to adding 1 if quantity not provided
            } else {
                // Add new product with quantity 1 if not specified
                state.products.push({
                    ...action.payload,
                    quantity: action.payload.quantity || 1,
                });
            }
        },
        increaseQuantity: (state, action) => {
            const existingProduct = state.products.find(
                (item) => item.productId === action.payload.productId
            );
            if (existingProduct) {
                existingProduct.quantity++;
            }
        },
        decreaseQuantity: (state, action) => {
            const existingProduct = state.products.find(
                (item) => item.productId === action.payload.productId
            );
            if (existingProduct && existingProduct.quantity > 1) {
                existingProduct.quantity--;
            }
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(
                item => item.productId !== action.payload
            );
        },
        resetCart: (state) => {
            state.products = [];
        },
        setCart: (state, action) => {
            state.products = action.payload;
        }

    },
});


// Selector to calculate total quantity in cart
export const selectCartTotalQuantity = (state) =>
    state.orebiSlices.products.reduce((total, item) => total + item.quantity, 0);

export const { addToCart, increaseQuantity, decreaseQuantity, deleteProduct, resetCart, setCart } = orebiSlice.actions;

export default orebiSlice.reducer;
