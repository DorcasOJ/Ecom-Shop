import { Axios } from "../../config/axios";

export const fetchAllCategories = async () => {
  try {
    const res = await Axios.get("/categories");
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCategoryById = async (id) => {
  try {
    const res = await Axios.get(`/category/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// body object, category id and userId, user must be admin
export const updateCategoryById = async (body) => {
  try {
    const res = await Axios.get(`/category/update/${body._id}/${body.userId}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// search or/and category query
export const searchCategory = async (body) => {
  let queryString = "";
  if (body.search) {
    queryString += `search=${body.search}`;
  }

  try {
    const res = await Axios.get(`/categories/search/?${queryString}`);

    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// body object, category id and userId, user must be admin
export const createCategory = async (body) => {
  try {
    const res = await Axios.get(`/category/create/${body.userId}`, body);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// body object, category id and userId, user must be admin
export const deleteCategory = async (body) => {
  try {
    const res = await Axios.delete(
      `/category/delete/ ${body._id}/${body.userId}`
    );
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};
