import { Axios } from "../../config/axios";

export const addToCart = async (item) => {
  try {
    const res = await Axios.post(`/cart/create/${item.user}`, item);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCartByUserId = async (id) => {
  try {
    const res = await Axios.get(`/cart/user/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateCartItemById = async (update) => {
  try {
    const res = await Axios.put(
      `/cart/user/${update._id}/${update.user}`,
      update
    );
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteCartItemById = async (body) => {
  try {
    const res = await Axios.delete(`/cart/user/${body.id}/${body.user}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetCartByUserId = async (userId) => {
  try {
    const res = await Axios.delete(`/cart/user/${userId}`);
    return res.data;
  } catch (error) {
    throw error?.response?.data;
  }
};
