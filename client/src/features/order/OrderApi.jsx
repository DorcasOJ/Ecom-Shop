import { Axios } from "../../config/axios";

export const createOrder = async (order) => {
  try {
    const res = await Axios.post(`/order/create/${order.user}`, order);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getOrderByUserId = async (id) => {
  try {
    const res = await Axios.get(`/order/user/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllOrders = async (id) => {
  try {
    // check later
    const res = await Axios.get(`/orders/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStatusValues = async () => {
  try {
    const res = await Axios.get(`/order/status-values`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateOrderById = async (update) => {
  try {
    const res = await Axios.patch(`/order/${update._id}/status/${update.user}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};
