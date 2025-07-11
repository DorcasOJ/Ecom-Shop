import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createReview,
  deleteReviewsById,
  fetchReviewsByProductId,
  updateReviewsById,
} from "./reviewApi";

const initialState = {
  reviewAddStatus: "idle",
  reviewDeleteStatus: "idle",
  reviewUpdateStatus: "idle",
  reviewFetchStatus: "idle",
  reviews: [],
  errors: null,
  successMessage: null,
};

export const createReviewAsync = createAsyncThunk(
  "review/createReviewAsync",
  async (review) => {
    const createdReview = await createReview(review);
    return createdReview;
  }
);

export const fetchReviewsByProductIdAsync = createAsyncThunk(
  "review/fetchReviewsByProductIdAsync",
  async (id) => {
    const reviews = await fetchReviewsByProductId(id);
    return reviews;
  }
);

export const updateReviewsByIdAsync = createAsyncThunk(
  "review/updateReviewsByIdAsync",
  async (review) => {
    const updatedReview = await updateReviewsById(review);
    return updatedReview;
  }
);

export const deleteReviewsByIdAsync = createAsyncThunk(
  "review/deleteReviewsByIdAsync",
  async (review) => {
    const deletedReview = await deleteReviewsById(review);
    return deletedReview;
  }
);

export const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState: initialState,
  reducers: {
    resetReviewAddStatus: (state) => {
      state.reviewAddStatus = "idle";
    },
    resetReviewFetchStatus: (state) => {
      state.reviewFetchStatus = "idle";
    },
    resetReviewUpdateStatus: (state) => {
      state.reviewUpdateStatus = "idle";
    },
    resetReviewDeleteStatus: (state) => {
      state.reviewDeleteStatus = "idle";
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(createReviewAsync.pending, (state) => {
        state.reviewAddStatus = "pending";
      })
      .addCase(createReviewAsync.fulfilled, (state, action) => {
        state.reviewAddStatus = "fulfilled";
        state.reviews.push(action.payload);
      })
      .addCase(createReviewAsync.rejected, (state, action) => {
        state.reviewAddStatus = "rejected";
        state.errors = action.error;
      })
      .addCase(fetchReviewsByProductIdAsync.pending, (state) => {
        state.reviewFetchStatus = "pending";
      })

      .addCase(fetchReviewsByProductIdAsync.fulfilled, (state, action) => {
        state.reviewFetchStatus = "fulfilled";
        state.reviews = action.payload;
      })

      .addCase(fetchReviewsByProductIdAsync.rejected, (state, action) => {
        state.reviewFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(updateReviewsByIdAsync.pending, (state) => {
        state.reviewUpdateStatus = "pending";
      })

      .addCase(updateReviewsByIdAsync.fulfilled, (state, action) => {
        state.reviewUpdateStatus = "fulfilled";
        const index = state.reviews.findIndex(
          (review) => review._id === action.payload._id
        );
        state.reviews[index] = action.payload;
      })

      .addCase(updateReviewsByIdAsync.rejected, (state, action) => {
        state.reviewUpdateStatus = "pending";
        state.errors = action.error;
      })

      .addCase(deleteReviewsByIdAsync.pending, (state) => {
        state.reviewDeleteStatus = "pending";
      })

      .addCase(deleteReviewsByIdAsync.fulfilled, (state, action) => {
        state.reviewDeleteStatus = "fulfilled";
        const index = state.reviews.findIndex(
          (review) => review._id === action.payload._id
        );
        state.reviews[index] = action.payload;
      })

      .addCase(deleteReviewsByIdAsync.rejected, (state, action) => {
        state.reviewDeleteStatus = "rejected";
        state.errors = action.error;
      });
  },
});

export const selectReviewAddStatus = (state) =>
  state.ReviewSlice.reviewAddStatus;
export const selectReviewFetchStatus = (state) =>
  state.ReviewSlice.reviewFetchStatus;
export const selectReviewUpdateStatus = (state) =>
  state.ReviewSlice.reviewUpdateStatus;
export const selectReviewDeleteStatus = (state) =>
  state.ReviewSlice.reviewDeleteStatus;
export const selectReviewErrors = (state) => state.ReviewSlice.errors;
export const selectReviewSuccessMessage = (state) =>
  state.ReviewSlice.successMessage;
export const selectReviews = (state) => state.ReviewSlice.reviews;

export const {
  resetReviewAddStatus,
  resetReviewFetchStatus,
  resetReviewUpdateStatus,
  resetReviewDeleteStatus,
} = reviewSlice.actions;

export default reviewSlice.reducer;
