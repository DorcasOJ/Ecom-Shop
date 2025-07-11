import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import {
//   fetchAllBrands,
//   createBrand,
//   updateBrandById,
//   getBrandById,
//   searchBrand,
//   deleteBrand,
// } from "./BrandsApi";
import {
  createBrand,
  getBrandById,
  updateBrandById,
  fetchAllBrands,
  deleteBrand,
  searchBrand,
} from "./BrandsApi";

const initialState = {
  status: "idle",
  brandUpdateStatus: "idle",
  brandAddStatus: "idle",
  brandFetchStatus: "idle",
  brandSearchStatus: "idle",
  selectedBrand: null,
  brands: [],
  errors: null,
  successMessage: null,
};

export const fetchAllBrandsAsync = createAsyncThunk(
  "brands/fetchAllBrandsAsync",
  async () => {
    const brands = await fetchAllBrands();
    return brands;
  }
);

export const getBrandByIdAsync = createAsyncThunk(
  "brands/getBrandByIdAsync",
  async (id) => {
    const brand = await getBrandById(id);
    return brand;
  }
);

export const createBrandAsync = createAsyncThunk(
  "brands/createBrandAsync",
  async (body) => {
    const createdBrand = await createBrand(body);
    return createdBrand;
  }
);

export const updateBrandByIdAsync = createAsyncThunk(
  "brands/updateBrandAsync",
  async (update) => {
    const updatedBrand = await updateBrandById(update);
    return updatedBrand;
  }
);

export const searchBrandAsync = createAsyncThunk(
  "brands/searchBrandAsync",
  async (body) => {
    const searchedBrand = await searchBrand(body);
    return searchedBrand;
  }
);

export const deleteBrandAsync = createAsyncThunk(
  "brands/deleteBrandAsync",
  async (body) => {
    const deletedBrand = await deleteBrand(body);
    return deletedBrand;
  }
);

const brandSlice = createSlice({
  name: "brandSlice",
  initialState: initialState,
  reducers: {
    clearBrandErrors: (state) => {
      state.errors = null;
    },
    clearBrandSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearSelectedBrand: (state) => {
      state.selectedBrand = null;
    },
    resetBrandStatus: (state) => {
      state.status = "idle";
    },
    resetBrandUpdateStatus: (state) => {
      state.brandUpdateStatus = "idle";
    },
    resetBrandAddStatus: (state) => {
      state.brandAddStatus = "idle";
    },
    resetBrandFetchStatus: (state) => {
      state.brandFetchStatus = "idle";
    },
    resetBrandSearchStatus: (state) => {
      state.brandSearchStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBrandsAsync.pending, (state) => {
        state.brandFetchStatus = "idle";
      })

      .addCase(fetchAllBrandsAsync.fulfilled, (state, action) => {
        state.brandFetchStatus = "fulfilled";
        state.brands = action.payload;
      })

      .addCase(fetchAllBrandsAsync.rejected, (state, action) => {
        state.brandFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(getBrandByIdAsync.pending, (state) => {
        state.brandFetchStatus = "idle";
      })

      .addCase(getBrandByIdAsync.fulfilled, (state, action) => {
        state.brandFetchStatus = "fulfilled";
        state.selectedBrand = action.payload;
      })

      .addCase(getBrandByIdAsync.rejected, (state, action) => {
        state.brandFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(createBrandAsync.pending, (state) => {
        state.brandAddStatus = "idle";
      })

      .addCase(createBrandAsync.fulfilled, (state, action) => {
        state.brandAddStatus = "fulfilled";
        state.brands.push(action.payload);
      })

      .addCase(createBrandAsync.rejected, (state, action) => {
        state.brandAddStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(updateBrandByIdAsync.pending, (state) => {
        state.brandUpdateStatus = "idle";
      })

      .addCase(updateBrandByIdAsync.fulfilled, (state, action) => {
        state.brandUpdateStatus = "fulfilled";
        const index = state.brands.findIndex(
          (product) => product._id === action.payload._id
        );
        state.brands[index] = action.payload;
      })

      .addCase(updateBrandByIdAsync.rejected, (state, action) => {
        state.brandUpdateStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(searchBrandAsync.pending, (state) => {
        state.brandSearchStatus = "idle";
      })

      .addCase(searchBrandAsync.fulfilled, (state, action) => {
        state.brandSearchStatus = "fulfilled";
        state.brands = action.payload;
      })

      .addCase(searchBrandAsync.rejected, (state, action) => {
        state.brandSearchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(deleteBrandAsync.pending, (state) => {
        state.status = "pending";
      })

      .addCase(deleteBrandAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.brands = state.brands.filter(
          (Brand) => Brand._id === action.payload._id
        );
      })

      .addCase(deleteBrandAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      });
  },
});

// exporting selectors
export const selectBrandStatus = (state) => state.BrandSlice.status;
export const selectBrandUpdateStatus = (state) =>
  state.BrandSlice.brandUpdateStatus;
export const selectBrandAddStatus = (state) => state.BrandSlice.brandAddStatus;
export const selectBrandFetchStatus = (state) =>
  state.BrandSlice.brandFetchStatus;
export const selectBrandSearchStatus = (state) =>
  state.BrandSlice.brandSearchStatus;
export const selectBrandErrors = (state) => state.BrandSlice.errors;
export const selectBrandSuccessMessage = (state) =>
  state.BrandSlice.successMessage;
export const selectBrands = (state) => state.BrandSlice.brands;

// exporting actions
export const {
  clearBrandErrors,
  clearBrandSuccessMessage,
  clearSelectedBrand,
  resetBrandStatus,
  resetBrandUpdateStatus,
  resetBrandAddStatus,
  resetBrandFetchStatus,
  resetBrandSearchStatus,
} = brandSlice.actions;

export default brandSlice.reducer;
