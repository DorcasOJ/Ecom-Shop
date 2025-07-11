import { useDispatch, useSelector } from "react-redux";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistFetchStatus,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  resetWishlistItemUpdateStatus,
  selectWishlistFetchStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItemUpdateStatus,
  selectWishlists,
  updateWishlistItemByIdAsync,
} from "../WishlistSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import {
  addToCartAsync,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
  selectCartItems,
} from "../../cart/CartSlice";
import { useTheme } from "@emotion/react";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Grid,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import { emptyWishlistAnimation, loadingAnimation } from "../../../assets";
import { MotionConfig, motion } from "framer-motion";
import { ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ProductCard } from "../../products/components/ProductCard";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

export const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlists);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
  const wishlistItemUpdateStatus = useSelector(selectWishlistItemUpdateStatus);
  const wishlistItemFetchStatus = useSelector(selectWishlistFetchStatus);

  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems);
  const cartItemsAddStatus = useSelector(selectCartItemAddStatus);

  const [editIndex, setEditIndex] = useState(-1);
  const [editValue, setEditValue] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const theme = useTheme();
  const is1130 = useMediaQuery(theme.breakpoints.down(1130));
  const is642 = useMediaQuery(theme.breakpoints.down(642));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (wishlistItemAddStatus === "fulfilled") {
      toast.success("product added to wishlist");
    } else if (wishlistItemAddStatus === "rejected") {
      toast.error("Error adding product to wishlist, please try again later");
    }
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === "fulfilled") {
      toast.success("product removed from wishlist");
    } else if (wishlistItemDeleteStatus === "rejected") {
      toast.error(
        "Error removing product from wishlist, please try again later"
      );
    }
  }, [wishlistItemDeleteStatus]);

  useEffect(() => {
    if (wishlistItemUpdateStatus === "fulfilled") {
      toast.success("product updated to wishlist");
    } else if (wishlistItemUpdateStatus === "rejected") {
      toast.error("Error updating product to wishlist, please try again later");
    }
  }, [wishlistItemUpdateStatus]);

  useEffect(() => {
    if (cartItemsAddStatus === "fulfilled") {
      toast.success("product added to cart");
    } else if (cartItemsAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later");
    }
  }, [cartItemsAddStatus]);

  useEffect(() => {
    if (wishlistItemFetchStatus === "rejected") {
      toast.error("Error fetching wishlist, please try again later ");
    }
  }, [wishlistItemFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetWishlistFetchStatus());
      dispatch(resetCartItemAddStatus());
      dispatch(resetWishlistItemUpdateStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetWishlistItemAddStatus());
    };
  }, []);

  const handleAddRemoveFromWishlist = (e, productId) => {
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: productId };
      dispatch(createWishlistItemAsync(data));
    } else if (!e.target.checked) {
      const index = wishlistItems.findIndex(
        (item) => item.product?._id === productId
      );
      dispatch(
        deleteWishlistItemByIdAsync({
          _id: wishlistItems[index]._id,
          userId: loggedInUser?._id,
        })
      );
    }
  };

  const handleNoteUpdate = (wishlistItemId) => {
    const update = {
      _id: wishlistItemId,
      note: editValue,
      userId: loggedInUser?._id,
    };
    dispatch(updateWishlistItemByIdAsync(update));
    setEditIndex(-1);
    setEditValue("");
  };

  const handleEdit = (index) => {
    setEditValue(wishlistItems[index].note);
    setEditIndex(index);
  };

  const handleAddToCart = (productId) => {
    const data = { user: loggedInUser?._id, product: productId };
    dispatch(addToCartAsync(data));
  };

  return (
    <Stack
      justifyContent={"flex-start"}
      mt={is480 ? 3 : 5}
      mb={"14rem"}
      alignItems={"center"}
    >
      {wishlistItemFetchStatus === "pending" ? (
        <Stack
          width={is480 ? "auto" : "25rem"}
          height={"calc(100vh - 4rem)"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Lottie animationData={loadingAnimation} />
        </Stack>
      ) : (
        <Stack width={is1130 ? "auto" : "70rem"} rowGap={is480 ? 2 : 4}>
          {/* heading area and back button */}
          <Stack
            alignSelf={"flex-start"}
            flexDirection={"row"}
            columnGap={1}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <motion.div whileHover={{ x: -5 }}>
              <IconButton component={Link} to={"/"}>
                <ArrowBack fontSize={is480 ? "medium" : "large"} />
              </IconButton>
            </motion.div>

            <Typography variant="h4" fontWeight={500}>
              Your wishlist
            </Typography>
          </Stack>

          {/* product grid */}

          <Stack>
            {!wishlistItemFetchStatus === "pending" &&
            wishlistItems?.length === 0 ? (
              // empty wishlist animation
              <Stack>
                <Lottie animationData={emptyWishlistAnimation} />
                <Typography>You have no items in your wishlist</Typography>
              </Stack>
            ) : (
              // wishlist grid
              <Grid
                container
                gap={3}
                justifyContent={"center"}
                alignContent
                // sx={{ position: "relative" }}
              >
                {wishlistItems.map((item, index) => (
                  <Stack
                    component={is480 ? "" : Paper}
                    elevation={1}
                    key={item?._id}
                  >
                    <ProductCard
                      id={item?.product?._id}
                      price={item?.product?.price}
                      thumbnail={item?.product?.thumbnail}
                      brand={item?.product?.brand?.name}
                      title={item?.product?.title}
                      stockQuantity={item?.product?.stockQuantity}
                      handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                      isWishlistCard={true}
                    />

                    <Stack
                      paddingLeft={2}
                      paddingRight={2}
                      paddingBottom={2}
                      //   position={"relative"}
                    >
                      {/* note heading and icon */}
                      <Stack
                        flexDirection={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Typography variant="h6" fontWeight={400}>
                          Note
                        </Typography>
                        <IconButton onClick={() => handleEdit(index)}>
                          <ModeEditOutlineIcon />
                        </IconButton>
                      </Stack>

                      {editIndex === index ? (
                        <Stack rowGap={2}>
                          <TextField
                            multiline
                            rows={3}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            fontSize={"10px"}
                          />
                          <Stack
                            flexDirection={"row"}
                            columnGap={1}
                            alignSelf={"flex-end"}
                          >
                            <Button
                              onClick={() => handleNoteUpdate(item._id)}
                              size="small"
                              variant="contained"
                            >
                              Update
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => setEditIndex(-1)}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <Box>
                          <Typography
                            sz={{
                              wordWrap: "break-word",
                              color: item.note ? "text.primary" : "GrayText",
                            }}
                          >
                            {item.note ? item.note : "Add a custom note here"}
                          </Typography>
                        </Box>
                      )}

                      <Stack>
                        {cartItems.some(
                          (cartItem) =>
                            cartItem?.product?._id === item?.product?._id
                        ) ? (
                          <Button
                            variant="outlined"
                            component={Link}
                            sx={{ mt: 4 }}
                            size="small"
                            to={"/cart"}
                          >
                            Already in cart
                          </Button>
                        ) : (
                          <Button
                            sx={{ mt: 4 }}
                            size="small"
                            onClick={() => handleAddToCart(item?.product?._id)}
                            variant="contained"
                          >
                            Add To Cart
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                ))}
              </Grid>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
