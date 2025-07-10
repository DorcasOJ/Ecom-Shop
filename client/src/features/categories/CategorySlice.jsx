import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllCategories,
  createCategory,
  updateCategoryById,
  getCategoryById,
  searchCategory,
  deleteCategory,
} from "./CategoriesApi";

const initialState = {
  status: "idle",
  categoryUpdateStatus: "idle",
  categoryAddStatus: "idle",
  categoryFetchStatus: "idle",
  categorySearchStatus: "idle",
  selectedCategory: null,
  categories: [],
  errors: null,
  successMessage: null,
};

export const fetchAllCategoriesAsync = createAsyncThunk(
  "categories/fetchAllCategoriesAsync",
  async () => {
    const categories = await fetchAllCategories();
    return categories;
  }
);

export const getCategoryByIdAsync = createAsyncThunk(
  "categories/getCategoryByIdAsync",
  async (id) => {
    const category = await getCategoryById(id);
    return category;
  }
);

export const createCategoryAsync = createAsyncThunk(
  "categories/createCategoryAsync",
  async (body) => {
    const createdCategory = await createCategory(body);
    return createdCategory;
  }
);

export const updateCategoryByIdAsync = createAsyncThunk(
  "categories/updateCategoryAsync",
  async (update) => {
    const updatedCategory = await updateCategoryById(update);
    return updatedCategory;
  }
);

export const searchCategoryAsync = createAsyncThunk(
  "categories/searchCategoryAsync",
  async (body) => {
    const searchedCategory = await searchCategory(body);
    return searchedCategory;
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "categories/deleteCategoryAsync",
  async (body) => {
    const deletedCategory = await deleteCategory(body);
    return deletedCategory;
  }
);

const categorySlice = createSlice({
  name: "categorySlice",
  initialState: initialState,
  reducers: {
    clearCategoryErrors: (state) => {
      state.errors = null;
    },
    clearCategorySuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    resetCategoryStatus: (state) => {
      state.status = "idle";
    },
    resetCategoryUpdateStatus: (state) => {
      state.categoryUpdateStatus = "idle";
    },
    resetCategoryAddStatus: (state) => {
      state.categoryAddStatus = "idle";
    },
    resetCategoryFetchStatus: (state) => {
      state.categoryFetchStatus = "idle";
    },
    resetCategorySearchStatus: (state) => {
      state.categorySearchStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategoriesAsync.pending, (state) => {
        state.categoryFetchStatus = "idle";
      })

      .addCase(fetchAllCategoriesAsync.fulfilled, (state, action) => {
        state.categoryFetchStatus = "fulfilled";
        state.categories = action.payload;
      })

      .addCase(fetchAllCategoriesAsync.rejected, (state, action) => {
        state.categoryFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(getCategoryByIdAsync.pending, (state) => {
        state.categoryFetchStatus = "idle";
      })

      .addCase(getCategoryByIdAsync.fulfilled, (state, action) => {
        state.categoryFetchStatus = "fulfilled";
        state.selectedCategory = action.payload;
      })

      .addCase(getCategoryByIdAsync.rejected, (state, action) => {
        state.categoryFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(createCategoryAsync.pending, (state) => {
        state.categoryAddStatus = "idle";
      })

      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.categoryAddStatus = "fulfilled";
        state.categories.push(action.payload);
      })

      .addCase(createCategoryAsync.rejected, (state, action) => {
        state.categoryAddStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(updateCategoryByIdAsync.pending, (state) => {
        state.categoryUpdateStatus = "idle";
      })

      .addCase(updateCategoryByIdAsync.fulfilled, (state, action) => {
        state.categoryUpdateStatus = "fulfilled";
        const index = state.categories.findIndex(
          (product) => product._id === action.payload._id
        );
        state.categories[index] = action.payload;
      })

      .addCase(updateCategoryByIdAsync.rejected, (state, action) => {
        state.categoryUpdateStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(searchCategoryAsync.pending, (state) => {
        state.categorySearchStatus = "idle";
      })

      .addCase(searchCategoryAsync.fulfilled, (state, action) => {
        state.categorySearchStatus = "fulfilled";
        state.categories = action.payload;
      })

      .addCase(searchCategoryAsync.rejected, (state, action) => {
        state.categorySearchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(deleteCategoryAsync.pending, (state) => {
        state.status = "idle";
      })

      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.categories = state.categories.filter(
          (category) => category._id === action.payload._id
        );
      })

      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      });
  },
});

// exporting selectors
export const selectCategoryStatus = (state) => state.CategorySlice.status;
export const selectCategoryUpdateStatus = (state) =>
  state.CategorySlice.categoryUpdateStatus;
export const selectCategoryAddStatus = (state) =>
  state.CategorySlice.categoryAddStatus;
export const selectCategoryFetchStatus = (state) =>
  state.CategorySlice.categoryFetchStatus;
export const selectCategorySearchStatus = (state) =>
  state.CategorySlice.categorySearchStatus;
export const selectCategoryErrors = (state) => state.CategorySlice.errors;
export const selectCategorySuccessMessage = (state) =>
  state.CategorySlice.successMessage;
export const selectCategories = (state) => state.CategorySlice.categories;

// exporting actions
export const {
  clearCategoryErrors,
  clearCategorySuccessMessage,
  clearSelectedCategory,
  resetCategoryStatus,
  resetCategoryUpdateStatus,
  resetCategoryAddStatus,
  resetCategoryFetchStatus,
  resetCategorySearchStatus,
} = categorySlice.actions;

export default categorySlice.reducer;
