import { useEffect } from "react";
import { Login } from "../features/auth/components/Login";
import { Axios } from "../config/axios";

export const LoginPage = () => {
  useEffect(() => {
    const wakeServer = async () => {
      try {
        const res = await Axios.get("/auth/health");
        return res.data;
      } catch (error) {
        console.log("Server waking up..." + error.message);
      }
    };
    wakeServer();
  }, []);
  return <Login />;
};
