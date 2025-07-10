import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  getAllOrders,
  getOrderByUserId,
  getStatusValues,
  updateOrderById,
} from "./OrderApi";

const initialState = {
  status: "idle",
  orderFetchStatus: "idle",
  orderUpdateStatus: "idle",
  orders: [],
  orderStatusEnum: [],
  currentOrder: null,
  errors: null,
  successMessage: null,
};

export const 

createOrderAsync = createAsyncThunk(
  "orders/createOrderAsync",
  async (order) => {
    const createdOrder = await createOrder(order);
    return createdOrder;
  }
);

export const getAllOrdersAsync = createAsyncThunk(
  "orders/getAllOrdersAsync",
  async (order) => {
    const allOrder = await getAllOrders(order);
    return allOrder;
  }
);

export const getOrderByUserIdAsync = createAsyncThunk(
  "orders/getOrderByUserId",
  async (id) => {
    const getOrder = await getOrderByUserId(id);
    return getOrder;
  }
);

export const updateOrderByIdAsync = createAsyncThunk(
  "orders/updateOrderByIdAsync",
  async (order) => {
    const updatedOrder = await updateOrderById(order);
    return updatedOrder;
  }
);

export const getStatusValuesAsync = createAsyncThunk(
  "orders/getStatusValuesAsync",
  async () => {
    const statusValues = await getStatusValues();
    return statusValues;
  }
);

const orderSlice = createSlice({
  name: "orderSlice",
  initialState: initialState,
  reducers: {
    resetOrderUpdateStatus: (state) => {
      state.orderUpdateStatus = "idle";
    },
    resetOrderFetchStatus: (state) => {
      state.orderFetchStatus = "idle";
    },
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    resetOrderStatusEnum: (state) => {
      state.orderStatusEnum = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = "pending";
      })

      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })

      .addCase(createOrderAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.error;
      })

      .addCase(getAllOrdersAsync.pending, (state) => {
        state.orderFetchStatus = "pending";
      })

      .addCase(getAllOrdersAsync.fulfilled, (state, action) => {
        state.orderFetchStatus = "fulfilled";
        state.orders = action.payload;
      })

      .addCase(getAllOrdersAsync.rejected, (state, action) => {
        state.orderFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(getOrderByUserIdAsync.pending, (state) => {
        state.orderFetchStatus = "pending";
      })

      .addCase(getOrderByUserIdAsync.fulfilled, (state, action) => {
        state.orderFetchStatus = "fulfilled";
        state.orders = action.payload;
      })

      .addCase(getOrderByUserIdAsync.rejected, (state, action) => {
        state.orderFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(updateOrderByIdAsync.pending, (state) => {
        state.orderFetchStatus = "pending";
      })

      .addCase(updateOrderByIdAsync.fulfilled, (state, action) => {
        state.orderFetchStatus = "fulfilled";
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        state.orders[index] = action.payload;
      })

      .addCase(updateOrderByIdAsync.rejected, (state, action) => {
        state.orderFetchStatus = "rejected";
        state.errors = action.error;
      })

      .addCase(getStatusValuesAsync.pending, (state) => {
        state.orderFetchStatus = "pending";
      })

      .addCase(getStatusValuesAsync.fulfilled, (state, action) => {
        state.orderFetchStatus = "fulfilled";
        state.orderStatusEnum.push(action.payload);
      })

      .addCase(getStatusValuesAsync.rejected, (state, action) => {
        state.orderFetchStatus = "rejected";
        state.errors = action.error;
      });
  },
});

export const {
  resetCurrentOrder,
  resetOrderFetchStatus,
  orderUpdateStatus,
  resetOrderStatusEnum,
} = orderSlice.actions;

export const selectOrderStatus = (state) => state.OrderSlice.status;
export const selectOrderErrors = (state) => state.OrderSlice.error;
export const selectOrderSuccessMessage = (state) =>
  state.OrderSlice.successMessage;
export const selectOrderCurrentOrder = (state) => state.OrderSlice.currentOrder;
export const selectOrders = (state) => state.OrderSlice.orders;
export const selectOrderOrderUpdateStatus = (state) =>
  state.OrderSlice.orderUpdateStatus;
export const selectOrderFetchStatus = (state) =>
  state.OrderSlice.orderFetchStatus;
export const selectOrderStatusEnum = (state) =>
  state.OrderSlice.orderStatusEnum;

export default orderSlice.reducer;
