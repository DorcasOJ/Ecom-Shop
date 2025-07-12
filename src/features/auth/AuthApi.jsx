import { Axios } from "../../config/axios";

export const signup = async (cred) => {
  try {
    const res = await Axios.post("auth/signup", cred);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (cred) => {
  try {
    const res = await Axios.post("/auth/login", cred);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyOtp = async (cred) => {
  try {
    const res = await Axios.post("/auth/verify-otp", cred);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resendOtp = async (cred) => {
  try {
    const res = await Axios.post("/auth/resend-otp", cred);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const forgotPassword = async (cred) => {
  try {
    const res = await Axios.post("/auth/forgot-password", cred);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (cred) => {
  try {
    const res = await Axios.post("/auth/reset-password", cred);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const checkAuth = async (cred) => {
  try {
    const res = await Axios.get("/auth/check-auth", cred);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const res = await Axios.get("/auth/logout", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};
