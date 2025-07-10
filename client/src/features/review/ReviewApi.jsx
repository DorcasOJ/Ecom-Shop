import { Axios } from "../../config/axios";

export const createReview = async (review) => {
  try {
    const res = await Axios.post(`/review/create/${review.user}`, review);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchReviewsByProductId = async (body) => {
  let queryString = "";
  if (body.page) {
    queryString += `page=${body.page}&`;
  }

  if (body.limit) {
    queryString += `limit=${body.limit}&`;
  }
  try {
    // product id
    const res = await Axios.get(`/review/${body.id}?${queryString}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateReviewsById = async (update) => {
  try {
    const res = await Axios.patch(
      `/review/${update._id}/${update.userId}`,
      update
    );
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteReviewsById = async (body) => {
  try {
    const res = await Axios.delete(`/review/${body._id}/${body.userId}`, body);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};
