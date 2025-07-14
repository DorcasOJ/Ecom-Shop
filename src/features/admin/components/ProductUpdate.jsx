import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  deleteImageByIdAsync,
  fetchProductByIdAsync,
  resetProductUpdateStatus,
  selectProductDeleteImageStatus,
  selectProductFetchStatus,
  selectProductUpdateState,
  selectSelectedProduct,
  updateProductByIdAsync,
} from "../../products/ProductSlice";
import { useForm } from "react-hook-form";
import { selectBrands } from "../../brands/BrandSlice";
import { selectCategories } from "../../categories/CategorySlice";
import {
  Button,
  FormControl,
  InputLabel,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProductField } from "./ProductField";
import { selectUserInfo } from "../../user/UserSlice";

export const ProductUpdate = () => {
  const { id } = useParams();

  const [fields, setFields] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedProduct = useSelector(selectSelectedProduct);
  const userInfo = useSelector(selectUserInfo);

  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const productUpdateStatus = useSelector(selectProductUpdateState);
  const productDeleteImageStatus = useSelector(selectProductDeleteImageStatus);
  const productFetchStatus = useSelector(selectProductFetchStatus);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const is660 = useMediaQuery(theme.breakpoints.down(660));

  const handleProductUpdate = (data) => {
    const imageArray = [];

    fields.forEach((value) => {
      imageArray.push(data[`${value}`]);
    });

    const updateProduct = {
      _id: selectedProduct._id,
      ...data,
      userId: userInfo._id,
      images: [...imageArray],
    };
    // console.log(updateProduct, "update");
    dispatch(updateProductByIdAsync(updateProduct));
  };

  const handleDeleteProductImage = (imageString) => {
    dispatch(
      deleteImageByIdAsync({
        _id: selectedProduct._id,
        userId: userInfo._id,
        image: imageString,
      })
    );
    dispatch(fetchProductByIdAsync(id));
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (productUpdateStatus === "fulfilled") {
      toast.success("Product Updated");
      navigate("/admin/dashboard");
    } else if (productUpdateStatus === "rejected") {
      toast.error("Error updating product, please try again later");
    }
  }, [productUpdateStatus]);

  useEffect(() => {
    if (productDeleteImageStatus === "fulfilled") {
      toast.success("Image Deleted");
    } else if (productDeleteImageStatus === "rejected") {
      toast.error("Error deleting image, please try again later");
    }
  }, [productDeleteImageStatus]);

  useEffect(() => {
    return () => {
      //   dispatch(clearSelectedProduct());
      dispatch(resetProductUpdateStatus());
    };
  });

  return (
    <Stack
      p={"0 16px"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"row"}
    >
      {selectedProduct && (
        <Stack component={Paper} elevation={1} p={5}>
          <Stack
            width={is1100 ? "100%" : "70rem"}
            rowGap={4}
            mt={is480 ? 4 : 6}
            mb={6}
            component={"form"}
            noValidate
            onSubmit={handleSubmit(handleProductUpdate)}
          >
            <ProductField
              register={register}
              brands={brands}
              categories={categories}
              is480={is480}
              is660={is660}
              selectedProduct={selectedProduct}
              handleDeleteProductImage={handleDeleteProductImage}
              productFetchStatus={productFetchStatus}
              fields={fields}
              setFields={setFields}
            />

            <Stack
              flexDirection={"row"}
              alignSelf={"flex-end"}
              columnGap={is480 ? 1 : 2}
              mt={2}
            >
              <Button
                size={is480 ? "medium" : "large"}
                variant="contained"
                type="submit"
              >
                Update
              </Button>

              <Button
                size={is480 ? "medium" : "large"}
                variant="outlined"
                color="error"
                component={Link}
                to={"/admin/dashboard"}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
// register, brands, categories, is480,
