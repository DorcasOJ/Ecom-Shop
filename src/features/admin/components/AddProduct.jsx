import { useTheme } from "@emotion/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectBrands } from "../../brands/BrandSlice";
import { selectCategories } from "../../categories/CategorySlice";
import {
  addProductAsync,
  resetProductAddStatus,
  selectProductAddStatus,
} from "../../products/ProductSlice";
import { useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AddProduct = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const productAddStatus = useSelector(selectProductAddStatus);

  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const handleProduct = (data) => {
    const newProduct = { ...data };
    dispatch(addProductAsync(newProduct));
  };

  useEffect(() => {
    if (productAddStatus === "fulfilled") {
      toast.success("New Product added");
      reset();
      navigate("/admin/dashboard");
    } else if (productAddStatus === "rejected") {
      toast.error("Error adding Product, please try again later");
    }
  }, [productAddStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetProductAddStatus());
    };
  });
};
