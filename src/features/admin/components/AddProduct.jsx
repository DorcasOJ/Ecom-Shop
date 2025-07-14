import { useTheme } from "@emotion/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectBrands } from "../../brands/BrandSlice";
import { selectCategories } from "../../categories/CategorySlice";
import {
  addProductAsync,
  resetProductAddStatus,
  selectProductAddStatus,
} from "../../products/ProductSlice";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProductField } from "./ProductField";
import { selectUserInfo } from "../../user/UserSlice";

export const AddProduct = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [fields, setFields] = useState([]);

  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const productAddStatus = useSelector(selectProductAddStatus);

  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const is660 = useMediaQuery(theme.breakpoints.down(660));

  const handleAddProduct = (data) => {
    const imageArray = [];

    fields.forEach((value) => {
      imageArray.push(data[`${value}`]);
    });

    const newProduct = {
      ...data,
      user: userInfo._id,
      images: [...imageArray, data.image0],
    };
    delete newProduct.image0;
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

  return (
    <Stack
      p={"0 16px"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"row"}
    >
      <Stack
        width={is1100 ? "100%" : "70rem"}
        mt={is480 ? 4 : 6}
        mb={6}
        rowGap={4}
        component={"form"}
        noValidate
        onSubmit={handleSubmit(handleAddProduct)}
      >
        {/* field */}

        <ProductField
          register={register}
          brands={brands}
          categories={categories}
          is480={is480}
          is660={is660}
          newProduct={true}
          fields={fields}
          setFields={setFields}
        />

        {/* <Stack rowGap={3}>
          <Stack>
            <Typography>Title</Typography>
            <TextField
              {...register("title", { required: "Title is required" })}
            />
          </Stack>

          <Stack flexDirection={"row"}>
            <FormControl fullWidth>
              <InputLabel id="brand-selection">Brand</InputLabel>
              <Select
                {...register("brand", { required: "Brand is required" })}
                labelId="brand-selection"
                label="Brand"
              >
                {brands.map((brand) => (
                  <MenuItem value={brand._id}>{brand.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack flexDirection={"row"}>
            <FormControl fullWidth>
              <InputLabel id="category-selection">Category</InputLabel>
              <Select
                {...register("category", { required: "Category is required" })}
                labelId="category-selection"
                label="Category"
              >
                {brands.map((category) => (
                  <MenuItem value={category._id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack>
            <Typography variant="h6" fontWeight={400} gutterBottom>
              Description
            </Typography>
            <TextField
              multiline
              rows={4}
              {...register("description", {
                required: "Description is required",
              })}
            />
          </Stack>

          <Stack flexDirection={"row"}>
            <Stack flex={1}>
              <Typography variant="h6" fontWeight={400}>
                Price
              </Typography>
              <TextField
                type="number"
                {...register("price", { required: "price is required" })}
              />
            </Stack>

            <Stack flex={1}>
              <Typography variant="h6" fontWeight={400} gutterBottom>
                Discount {is480 ? "%" : "Percentage"}
              </Typography>
              <TextField
                type="number"
                {...register("discountPercentage", {
                  required: "discount percentage is required",
                })}
              />
            </Stack>
          </Stack>

          <Stack>
            <Typography variant="h6" fontWeight={400}>
              Quantity
            </Typography>
            <TextField
              type="number"
              {...register("stockQuantity", {
                required: "Stock Quantity is required",
              })}
            />
          </Stack>

          <Stack>
            <Typography variant="h6" fontWeight={400}>
              Thumbnail
            </Typography>
            <TextField
              {...register("thumbnail", {
                required: "Thumbnail is required",
              })}
            />
          </Stack>

          <Stack>
            <Typography variant="h6" fontWeight={400}>
              Product Image
            </Typography>
            <Stack rowGap={2}>
              <TextField
                {...register("image0", { required: "Image is required" })}
              />
              <TextField
                {...register("image1", { required: "Image is required" })}
              />
              <TextField
                {...register("image2", { required: "Image is required" })}
              />
              <TextField
                {...register("image3", { required: "Image is required" })}
              />
            </Stack>
          </Stack>
        </Stack> */}

        {/* action area */}
        <Stack
          flexDirection={"row"}
          alignSelf={"flex-end"}
          columnGap={is480 ? 1 : 2}
        >
          <Button
            size={is480 ? "medium" : "large"}
            variant="contained"
            type="submit"
            loading={productAddStatus === "pending"}
          >
            Add Product
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
  );
};
