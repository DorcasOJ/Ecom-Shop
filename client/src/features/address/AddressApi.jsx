import { Axios } from "../../config/axios";

export const addAddress = async (address) => {
  try {
    const res = await Axios.post(`/address/${address.user}`, address);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchAddressByUserId = async (id) => {
  try {
    const res = await Axios.get(`/address/user/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateAddressById = async (update) => {
  try {
    const res = await Axios.put(
      `/address/${update._id}/${update.user}`,
      update
    );
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteAddressById = async (body) => {
  try {
    const res = await Axios.delete(`/address/${body._id}/${body.user}`, body);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};
