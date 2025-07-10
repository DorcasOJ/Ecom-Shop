import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createWishlistItem,
  deleteWishlistItemById,
  fetchWishlistByUserId,
  updateWishlistItemById,
} from "./WishlistApi";

const initialState = {
  wishlistItemAddStatus: "idle",
  wishlistItemDeleteStatus: "idle",
  wishlistItemUpdateStatus: "idle",
  wishlistFetchStatus: "idle",
  wishlists: [],
  errors: null,
  successMessage: null,
};

export const createWishlistItemAsync = createAsyncThunk(
  "Wishlist/createWishlistItem/Async",
  async (wishlist) => {
    const createdWishlist = await createWishlistItem(wishlist);
    return createdWishlist;
  }
);

export const fetchWishlistByUserIdAsync = createAsyncThunk(
  "Wishlist/fetchWishlistsByUserIdAsync",
  async (body) => {
    const Wishlists = await fetchWishlistByUserId(body);
    return Wishlists;
  }
);

export const updateWishlistItemByIdAsync = createAsyncThunk(
  "Wishlist/updateWishlistItemByIdAsync",
  async (wishlist) => {
    const updatedWishlist = await updateWishlistItemById(wishlist);
    return updatedWishlist;
  }
);

export const deleteWishlistItemByIdAsync = createAsyncThunk(
  "Wishlist/deleteWishlistItemByIdAsync",
  async (wishlist) => {
    const deletedWishlist = await deleteWishlistItemById(wishlist);
    return deletedWishlist;
  }
);

export const wishlistSlice = createSlice({
  name: "WishlistSlice",
  initialState: initialState,
  reducers: {
    resetWishlistItemAddStatus: (state) => {
      state.wishlistItemAddStatus = "idle";
    },
    resetWishlistFetchStatus: (state) => {
      state.wishlistFetchStatus = "idle";
    },
    resetWishlistItemUpdateStatus: (state) => {
      state.wishlistItemUpdateStatus = "idle";
    },
    resetWishlistItemDeleteStatus: (state) => {
      state.wishlistItemDeleteStatus = "idle";
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(createWishlistItemAsync.pending, (state) => {
        state.wishlistItemAddStatus = "pending";
      })
      .addCase(createWishlistItemAsync.fulfilled, (state, action) => {
        state.wishlistItemAddStatus = "fulfilled";
        state.wishlists.push(action.payload);
      })
      .addCase(createWishlistItemAsync.rejected, (state, action) => {
        state.wishlistItemAddStatus = "rejected";
        state.errors = action.error;
      })
      .addCase(fetchWishlistByUserIdAsync.pending, (state) => {
        state.wishlistFetchStatus = "pending";
      })

      .addCase(fetchWishlistByUserIdAsync.fulfilled, (state, action) => {
        state.wishlistFetchStatus = "fulfilled";
        state.wishlists = action.payload;
      })

      .addCase(fetchWishlistByUserIdAsync.rejected, (state, action) => {
        state.wishlistFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(updateWishlistItemByIdAsync.pending, (state) => {
        state.wishlistItemUpdateStatus = "pending";
      })

      .addCase(updateWishlistItemByIdAsync.fulfilled, (state, action) => {
        state.wishlistItemUpdateStatus = "fulfilled";
        const index = state.wishlists.findIndex(
          (Wishlist) => Wishlist._id === action.payload._id
        );
        state.wishlists[index] = action.payload;
      })

      .addCase(updateWishlistItemByIdAsync.rejected, (state, action) => {
        state.wishlistItemUpdateStatus = "pending";
        state.errors = action.error;
      })

      .addCase(deleteWishlistItemByIdAsync.pending, (state) => {
        state.wishlistItemDeleteStatus = "pending";
      })

      .addCase(deleteWishlistItemByIdAsync.fulfilled, (state, action) => {
        state.wishlistItemDeleteStatus = "fulfilled";
        state.wishlists = state.wishlists.filter(
          (item) => item._id !== action.payload._id
        );
      })

      .addCase(deleteWishlistItemByIdAsync.rejected, (state, action) => {
        state.wishlistItemDeleteStatus = "rejected";
        state.errors = action.error;
      });
  },
});

export const selectWishlistItemAddStatus = (state) =>
  state.WishlistSlice.wishlistItemAddStatus;
export const selectWishlistFetchStatus = (state) =>
  state.WishlistSlice.WishlistFetchStatus;
export const selectWishlistItemUpdateStatus = (state) =>
  state.WishlistSlice.wishlistItemUpdateStatus;
export const selectWishlistItemDeleteStatus = (state) =>
  state.WishlistSlice.wishlistItemDeleteStatus;
export const selectWishlistErrors = (state) => state.WishlistSlice.errors;
export const selectWishlistSuccessMessage = (state) =>
  state.WishlistSlice.successMessage;
export const selectWishlists = (state) => state.WishlistSlice.wishlists;

export const {
  resetWishlistItemAddStatus,
  resetWishlistFetchStatus,
  resetWishlistItemUpdateStatus,
  resetWishlistItemDeleteStatus,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
