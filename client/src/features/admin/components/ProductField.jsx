import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export const ProductField = ({
  register,
  brands,
  categories,
  is480,
  is660,
  selectedProduct,
  handleDeleteProductImage,
  productFetchStatus,
  fields,
  setFields,
  newProduct = false,
}) => {
  const [images, setImages] = useState({});

  return (
    <Stack rowGap={3}>
      <Stack>
        <Typography variant="h6" fontWeight={400} gutterBottom>
          Title
        </Typography>
        <TextField
          fullWidth
          {...register("title", { required: "Title is required" })}
          defaultValue={newProduct ? "" : selectedProduct.title}
        />
      </Stack>
      <Stack flexDirection={"row"}>
        <FormControl fullWidth>
          <InputLabel id="brand-selection">Brand</InputLabel>
          <Select
            {...register("brand", { required: "Brand is required" })}
            labelId="brand-selection"
            label="Brand"
            defaultValue={newProduct ? "" : selectedProduct?.brand._id}
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
            defaultValue={newProduct ? "" : selectedProduct?.category._id}
            {...register("category", { required: "Category is required" })}
            labelId="category-selection"
            label="Category"
          >
            {categories.map((category) => (
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
          defaultValue={newProduct ? "" : selectedProduct.description}
          fullWidth
        />
      </Stack>
      <Stack flexDirection={"row"} columnGap={1}>
        <Stack flex={1}>
          <Typography variant="h6" fontWeight={400} gutterBottom>
            Price in Naira
          </Typography>
          <TextField
            type="number"
            defaultValue={newProduct ? "" : selectedProduct.price}
            {...register("price", { required: "price is required" })}
            fullWidth
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
            defaultValue={newProduct ? "" : selectedProduct.discountPercentage}
            fullWidth
          />
        </Stack>
      </Stack>
      <Stack>
        <Typography variant="h6" fontWeight={400}>
          Quantity
        </Typography>
        <TextField
          fullWidth
          type="number"
          {...register("stockQuantity", {
            required: "Stock Quantity is required",
          })}
          defaultValue={newProduct ? "" : selectedProduct.stockQuantity}
        />
      </Stack>
      <Stack>
        <Typography variant="h6" fontWeight={400}>
          Thumbnail
        </Typography>
        <TextField
          fullWidth
          {...register("thumbnail", {
            required: "Thumbnail is required",
          })}
          defaultValue={newProduct ? "" : selectedProduct.thumbnail}
        />
      </Stack>
      <Stack>
        <Typography variant="h6" fontWeight={400} mb={2}>
          Product Images (minimum of 2 images)
        </Typography>
        <Stack rowGap={3}>
          {productFetchStatus === "pending" ? (
            <Stack>
              <Lottie animationData={loadingAnimation} />
            </Stack>
          ) : (
            !newProduct &&
            selectedProduct.images.map((image, index) => (
              <Stack
                rowGap={1}
                component={Paper}
                elevation={1}
                p={2}
                position={"relative"}
                flexDirection={"row"}
                alignItems={"center"}
              >
                <Stack
                  flex={5}
                  rowGap={1}
                  flexDirection={is660 ? "column" : "row"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  columnGap={1}
                >
                  <Stack alignItems={"center"} justifyContent={"center"}>
                    <img
                      src={image}
                      alt={`${selectedProduct.title}-${index}`}
                      style={{ width: "9rem" }}
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    {...register(`image${index}`, {
                      required: "Image is required",
                    })}
                    value={selectedProduct.images[index]}
                  />
                </Stack>

                <IconButton
                  sx={{
                    "&:hover": {
                      color: "#850836",
                    },
                  }}
                  onClick={() => handleDeleteProductImage(image)}
                >
                  <DeleteIcon
                    fontSize="large"
                    sx={{
                      "&:hover": {
                        color: "red-900",
                      },
                    }}
                  />
                </IconButton>
              </Stack>
            ))
          )}

          {newProduct && (
            <Stack
              flexDirection={is660 ? "column" : "row"}
              component={Paper}
              elevation={1}
              rowGap={1}
              columnGap={1}
              alignItems={"center"}
              justifyContent={"center"}
              p={2}
            >
              <Stack alignItems={"center"} justifyContent={"center"}>
                {images.image0 && (
                  <img
                    src={images.image0}
                    alt="image-display"
                    style={{ width: "9rem" }}
                  />
                )}
              </Stack>
              <TextField
                fullWidth
                {...register("image0", { required: "Image is required" })}
                onChange={(e) =>
                  setImages((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </Stack>
          )}

          {/* button to add or pop state */}
          <Stack
            flexDirection={"row"}
            alignItems={"flex-end"}
            justifyContent={"flex-end"}
          >
            <IconButton
              sx={{
                padding: "1px",
                mr: "15px",
                "&:hover": {
                  color: "#2cb109",
                },
              }}
              onClick={() =>
                setFields((prev) => [...prev, `field-${prev.length || 0}`])
              }
            >
              <AddIcon fontSize="large" />
            </IconButton>
          </Stack>

          {/* add new textfield */}
          {fields.map((_, index) => (
            <Stack
              key={`field-${index}`}
              flexDirection={"row"}
              component={Paper}
              elevation={1}
              rowGap={1}
              columnGap={1}
              alignItems={"center"}
              p={2}
            >
              <Stack
                flexDirection={is660 ? "column" : "row"}
                alignItems={"center"}
                justifyContent={"center"}
                rowGap={1}
                columnGap={1}
                flex={5}
              >
                <Stack alignItems={"center"} justifyContent={"center"}>
                  {images[`field-${index}`] && (
                    <img
                      src={images[`field-${index}`]}
                      alt="image-display"
                      style={{ width: "9rem" }}
                    />
                  )}
                </Stack>
                <TextField
                  fullWidth
                  {...register(`field-${index}`, {
                    required: "Image is required",
                  })}
                  onChange={(e) =>
                    setImages((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
              </Stack>

              <IconButton
                sx={{
                  "&:hover": {
                    color: "#850836",
                  },
                }}
                onClick={() =>
                  setFields((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <DeleteIcon
                  fontSize="large"
                  sx={{
                    "&:hover": {
                      color: "red-900",
                    },
                  }}
                />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
