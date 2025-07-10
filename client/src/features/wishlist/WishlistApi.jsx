import { Axios } from "../../config/axios";

export const createWishlistItem = async (wishlist) => {
  try {
    const res = await Axios.post(`/wishlist/${wishlist.user}`, wishlist);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchWishlistByUserId = async (body) => {
  let queryString = "";
  if (body.page) {
    queryString += `page=${body.page}&`;
  }

  if (body.limit) {
    queryString += `limit=${body.limit}&`;
  }
  try {
    const res = await Axios.get(`/wishlist/${body.id}?${queryString}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateWishlistItemById = async (update) => {
  try {
    const res = await Axios.put(
      `/wishlist/${update._id}/${update.userId}`,
      update
    );
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteWishlistItemById = async (body) => {
  try {
    const res = await Axios.delete(`/wishlist/${body._id}/${body.userId}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};
