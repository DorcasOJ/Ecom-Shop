import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addProduct,
  deleteImageById,
  deleteProductById,
  fetchProductById,
  fetchProducts,
  listRelatedBrands,
  listRelatedCategories,
  searchProduct,
  searchQuery,
  undeleteProductById,
  updateProductById,
} from "./ProductApi";

const initialState = {
  status: "idle",
  productDeleteImageStatus: "idle",
  productUpdateStatus: "idle",
  productFetchStatus: "idle",
  productAddStatus: "idle",
  productSearchStatus: "idle",
  productSearchQueryStatus: "idle",
  productRelatedCategoryStatus: "idle",
  productRelatedBrandStatus: "idle",
  productRelatedBrandProducts: [],
  productRelatedCategoryProducts: [],
  products: [],
  totalResults: 0,
  relatedBrandTotalResults: 0,
  relatedCategoryTotalResults: 0,
  isFilterOpen: false,
  selectedProduct: null,
  errors: null,
  successMessage: null,
};

export const addProductAsync = createAsyncThunk(
  "products/addProductAsync",
  async (data) => {
    const addedProduct = await addProduct(data);
    return addedProduct;
  }
);

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProductsAsync",
  async (filters) => {
    const products = await fetchProducts(filters);
    return products;
  }
);

export const fetchProductByIdAsync = createAsyncThunk(
  "products/fetchProductByIdAsync",
  async (id) => {
    const selectProduct = await fetchProductById(id);
    return selectProduct;
  }
);

export const updateProductByIdAsync = createAsyncThunk(
  "products/updateProductByIdAsync",
  async (update) => {
    const updatedProduct = await updateProductById(update);
    return updatedProduct;
  }
);

export const undeleteProductByIdAsync = createAsyncThunk(
  "products/undeleteProductByIdAsync",
  async (body) => {
    const unDeletedProduct = await undeleteProductById(body);
    return unDeletedProduct;
  }
);

export const deleteProductByIdAsync = createAsyncThunk(
  "products/deleteProductByIdAsync",
  async (body) => {
    const deletedProduct = await deleteProductById(body);
    return deletedProduct;
  }
);

export const searchProductAsync = createAsyncThunk(
  "products/searchProductAsync",
  async (body) => {
    const searchProduct = await searchProduct(body);
    return searchProduct;
  }
);

export const searchQueryAsync = createAsyncThunk(
  "products/searchQueryAsync",
  async (body) => {
    const searchQuery = await searchQuery(body);
    return searchQuery;
  }
);

export const relatedCategoryAsync = createAsyncThunk(
  "product/relatedCategoryAsync",
  async (id) => {
    const relatedCategory = await listRelatedCategories(id);
    return relatedCategory;
  }
);

export const relatedBrandAsync = createAsyncThunk(
  "product/relatedBrandAsync",
  async (id) => {
    const relatedBrand = await listRelatedBrands(id);
    return relatedBrand;
  }
);

export const deleteImageByIdAsync = createAsyncThunk(
  "product/deleteImageByIdAsync",
  async (body) => {
    const deletedImage = await deleteImageById(body);
    return deletedImage;
  }
);

const productSlice = createSlice({
  name: "productSlice",
  initialState: initialState,
  reducers: {
    clearProductErrors: (state) => {
      state.errors = null;
    },
    clearProductSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetProductStatus: (state) => {
      state.status = "idle";
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    resetProductUpdateStatus: (state) => {
      state.productUpdateStatus = "idle";
    },
    resetProductFetchStatus: (state) => {
      state.productFetchStatus = "idle";
    },
    resetProductAddStatus: (state) => {
      state.productAddStatus = "idle";
    },
    resetProductSearchStatus: (state) => {
      state.productSearchStatus = "idle";
    },
    resetProductSearchQueryStatus: (state) => {
      state.productSearchQueryStatus = "idle";
    },
    resetProductRelatedCategoryStatus: (state) => {
      state.productRelatedCategoryStatus = "idle";
    },
    resetProductRelatedBrandStatus: (state) => {
      state.productRelatedBrandStatus = "idle";
    },
    toggleFilters: (state) => {
      state.isFilterOpen = !state.isFilterOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductAsync.pending, (state) => {
        state.productAddStatus = "pending";
      })

      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.productAddStatus = "fulfilled";
        state.products.push(action.payload);
      })

      .addCase(addProductAsync.rejected, (state, action) => {
        state.productAddStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(fetchProductsAsync.pending, (state) => {
        state.productFetchStatus = "pending";
      })

      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.productFetchStatus = "fulfilled";
        state.products = action.payload.data;
        state.totalResults = action.payload.totalResults;
      })

      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.productFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.productFetchStatus = "pending";
      })

      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.productFetchStatus = "fulfilled";
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductByIdAsync.rejected, (state, action) => {
        state.productFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(updateProductByIdAsync.pending, (state) => {
        state.productUpdateStatus = "pending";
      })

      .addCase(updateProductByIdAsync.fulfilled, (state, action) => {
        state.productUpdateStatus = "fulfilled";
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        state.products[index] = action.payload;
      })

      .addCase(updateProductByIdAsync.rejected, (state, action) => {
        state.productUpdateStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(undeleteProductByIdAsync.pending, (state) => {
        state.status = "pending";
      })

      .addCase(undeleteProductByIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        state.products[index] = action.payload;
      })

      .addCase(undeleteProductByIdAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      })

      .addCase(deleteProductByIdAsync.pending, (state) => {
        state.status = "pending";
      })

      .addCase(deleteProductByIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        state.products[index] = action.payload;
      })

      .addCase(deleteProductByIdAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      })

      .addCase(deleteImageByIdAsync.pending, (state) => {
        state.productDeleteImageStatus = "pending";
      })

      .addCase(deleteImageByIdAsync.fulfilled, (state, action) => {
        state.productDeleteImageStatus = "fulfilled";
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        state.products[index] = action.payload;
      })

      .addCase(deleteImageByIdAsync.rejected, (state, action) => {
        state.productDeleteImageStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(searchQueryAsync.pending, (state) => {
        state.productSearchQueryStatus = "pending";
      })

      .addCase(searchQueryAsync.fulfilled, (state, action) => {
        state.productSearchQueryStatus = "fulfilled";
        state.products = action.payload.data;
        state.totalResults = action.payload.totalResults;
      })

      .addCase(searchQueryAsync.rejected, (state, action) => {
        state.productSearchQueryStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(searchProductAsync.pending, (state) => {
        state.productSearchStatus = "pending";
      })

      .addCase(searchProductAsync.fulfilled, (state, action) => {
        state.productSearchStatus = "fulfilled";
        state.products = action.payload.data;
        state.totalResults = action.payload.totalResults;
      })

      .addCase(searchProductAsync.rejected, (state, action) => {
        state.productSearchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(relatedBrandAsync.pending, (state) => {
        state.productRelatedBrandStatus = "pending";
      })

      .addCase(relatedBrandAsync.fulfilled, (state, action) => {
        state.productRelatedBrandStatus = "fulfilled";
        state.productRelatedBrandProducts = action.payload.data;
        state.relatedBrandTotalResults = action.payload.totalResults;
      })

      .addCase(relatedBrandAsync.rejected, (state, action) => {
        state.productRelatedBrandStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(relatedCategoryAsync.pending, (state) => {
        state.productRelatedCategoryStatus = "pending";
      })

      .addCase(relatedCategoryAsync.fulfilled, (state, action) => {
        state.productRelatedCategoryStatus = "fulfilled";
        state.productRelatedCategoryProducts = action.payload.data;
        state.relatedCategoryTotalResults = action.payload.totalResults;
      })

      .addCase(relatedCategoryAsync.rejected, (state, action) => {
        state.productRelatedCategoryStatus = "rejected";
        state.errors = action.error;
      });
  },
});

// exporting selectors
export const selectProductStatus = (state) => state.ProductSlice.status;
export const selectProducts = (state) => state.ProductSlice.products;
export const selectProductTotalResults = (state) =>
  state.ProductSlice.totalResults;
export const selectRelatedBrandTotalResults = (state) =>
  state.ProductSlice.relatedBrandTotalResults;
export const selectRelatedCategoryTotalResults = (state) =>
  state.ProductSlice.relatedCategoryTotalResults;
export const selectSelectedProduct = (state) =>
  state.ProductSlice.selectedProduct;
export const selectProductErrors = (state) => state.ProductSlice.errors;

export const selectProduct = (state) => state.ProductSlice.selectProduct;
export const selectProductSuccessMessage = (state) =>
  state.ProductSlice.successMessage;

export const selectProductUpdate = (state) =>
  state.ProductSlice.productUpdateStatus;
export const selectProductAddStatus = (state) =>
  state.ProductSlice.productAddStatus;
export const selectProductIsFilterOpen = (state) =>
  state.ProductSlice.isFilterOpen;
export const selectProductFetchStatus = (state) =>
  state.ProductSlice.productFetchStatus;
export const selectProductDeleteImageStatus = (state) =>
  state.ProductSlice.productDeleteImageStatus;
export const selectRelatedCategoryStatus = (state) =>
  state.ProductSlice.productRelatedCategoryStatus;
export const selectRelatedBrandStatus = (state) =>
  state.ProductSlice.productRelatedBrandStatus;

// export actions
export const {
  clearProductErrors,
  clearProductSuccessMessage,
  clearSelectedProduct,
  resetProductStatus,
  resetProductUpdateStatus,
  resetProductFetchStatus,
  resetProductAddStatus,
  resetProductSearchStatus,
  resetProductSearchQueryStatus,
  resetProductRelatedCategoryStatus,
  resetProductRelatedBrandStatus,
  toggleFilters,
} = productSlice.actions;

export default productSlice.reducer;
