import { Axios } from "../../config/axios";

// body object, brand id and userId, user must be admin
export const createBrand = async (body) => {
  try {
    const res = await Axios.get(`/brand/create/${body.userId}`, body);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchAllBrands = async () => {
  try {
    const res = await Axios.get("/brands");
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBrandById = async (id) => {
  try {
    const res = await Axios.get(`/brand/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// body object, brand id and userId, user must be admin
export const updateBrandById = async (body) => {
  try {
    const res = await Axios.get(`/brand/update/${body._id}/${body.userId}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// search or/and brand query
export const searchBrand = async (body) => {
  let queryString = "";
  if (body.search) {
    queryString += `search=${body.search}`;
  }

  try {
    const res = await Axios.get(`/brands/search/?${queryString}`);

    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};
// body object, brand id and userId, user must be admin
export const deleteBrand = async (body) => {
  try {
    const res = await Axios.delete(`/brand/delete/ ${body._id}/${body.userId}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};
