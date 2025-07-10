import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../features/auth/AuthSlice";
import UserSlice from "../features/user/UserSlice";
import ProductSlice from "../features/products/ProductSlice";
import CategorySlice from "../features/categories/CategorySlice";
import BrandSlice from "../features/brands/BrandSlice";
import WishlistSlice from "../features/wishlist/WishlistSlice";
import ReviewSlice from "../features/review/ReviewSlice";
import AddressSlice from "../features/address/AddressSlice";
import OrderSlice from "../features/order/OrderSlice";
import CartSlice from "../features/cart/CartSlice";

const arrayMiddleware = (store) => (next) => (action) => {
  if (Array.isArray(action)) {
    return action.forEach((a) => store.dispatch(a));
  }
  // console.log("DISPATCHED ACTION:", action);
  return next(action);
};

// custom middleware to allow dispatching promises
const promiseMiddleware = (store) => (next) => (action) => {
  if (typeof action?.then === "function") {
    // if action is a promise
    return action.then((resolvedAction) => {
      if (resolvedAction) store.dispatch(resolvedAction);
    });
  }
  // console.log("DISPATCHED ACTION:", action);
  return next(action);
};

export const store = configureStore({
  reducer: {
    AuthSlice,
    UserSlice,
    ProductSlice,
    CategorySlice,
    BrandSlice,
    AddressSlice,
    WishlistSlice,
    ReviewSlice,
    OrderSlice,
    CartSlice,
  },
  // add promise support
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(promiseMiddleware, arrayMiddleware),
});
