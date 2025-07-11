import { Axios } from "../../config/axios";

export const addProduct = async (data) => {
  try {
    const res = await Axios.post("/products", data);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchProducts = async (filters) => {
  let queryString = "";

  if (filters.category) {
    filters.category.map((cat) => {
      queryString += `category=${cat}&`;
    });
  }

  if (filters.brand) {
    filters.brand.map((brand) => {
      queryString += `brand=${brand}&`;
    });
  }

  if (filters.sort) {
    queryString += `sortBy=${filters.sort}&`;
  }

  if (filters.order) {
    queryString += `order=${filters.order}&`;
  }

  if (filters.pagination) {
    queryString += `limit=${filters.pagination.limit}&page=${filters.pagination.page}&`;
  }

  if (filters.user) {
    queryString += `user=${filters.user}&`;
  }

  try {
    const res = await Axios.get(`/products?${queryString}`);
    const totalResults = await res.headers.get("X-Total-Count");
    return {
      data: res.data,
      totalResults: totalResults,
    };
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await Axios.get(`/product/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProductById = async (update) => {
  try {
    const res = await Axios.put(
      `/product/update/${update._id}/${update.userId}`,
      update
    );
    return res;
  } catch (error) {
    throw error.response.data;
  }
};

export const undeleteProductById = async (body) => {
  try {
    const res = await Axios.put(
      `/product/restore-product/${body._id}/${body.userId}`
    );
    return res;
  } catch (error) {
    throw error.response.data;
  }
};

// only admin can delete
// query, productId and userId
export const deleteProductById = async (body) => {
  try {
    const res = await Axios.put(
      `/product/delete-product/${body._id}/${body.userId}`
    );
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

//  query id and userId
// body image URl to delete

export const deleteImageById = async (body) => {
  try {
    const res = await Axios.put(
      `/product/delete-image/${body._id}/${body.userId}`,
      body
    );
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const listRelatedBrands = async (id) => {
  try {
    const res = await Axios.get(`/products/related-brand/${id}`);
    return res;
  } catch (error) {
    throw error.response.data;
  }
};

export const listRelatedCategories = async (id) => {
  try {
    const res = await Axios.get(`/products/related-category/${id}`);
    return res;
  } catch (error) {
    throw error.response.data;
  }
};

// search value and/or category
export const searchQuery = async (body) => {
  let queryString = "";
  if (body.search) {
    queryString += `search=${body.search}&`;
  }
  if (body.category) {
    queryString += `?category=${body.category}&`;
  }
  try {
    const res = await Axios.get(`/products/search-query?${queryString}`);
    return res.response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const searchProduct = async (body) => {
  // {
  //  "filters": {
  //     "title": "dress",
  //     "price": [0, 300]
  //  },
  //  "sortBy": "price",
  //  "order": "desc",
  //  "limit": 10

  // }
  try {
    const res = await Axios.get("/products/search", body);
    return res.response.data;
  } catch (error) {
    throw error.response.data;
  }
};
