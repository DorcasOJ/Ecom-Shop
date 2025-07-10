import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuthAsync,
  selectLoggedInUser,
} from "../../features/auth/AuthSlice";

export const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthAsync);
  }, [dispatch]);
};
