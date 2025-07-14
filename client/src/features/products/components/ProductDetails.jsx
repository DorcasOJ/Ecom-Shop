import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectSelectedProduct,
} from "../ProductSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Checkbox,
  MobileStepper,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlists,
} from "../../wishlist/WishlistSlice";
import {
  fetchReviewsByProductIdAsync,
  resetReviewFetchStatus,
  selectReviewFetchStatus,
  selectReviews,
} from "../../review/ReviewSlice";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";
import { MotionConfig } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  CachedOutlined,
  FavoriteBorder,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LocalShippingOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  addToCartAsync,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
  selectCartItems,
} from "../../cart/CartSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Reviews } from "../../review/components/Reviews";

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = ["#020202", "#F6F6F6", "#B82222", "#BEA9A9", "#E2BB8D"];

export const ProductDetails = () => {
  const { id } = useParams();
  const product = useSelector(selectSelectedProduct);
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(-1);
  const [imageStep, setImageStep] = useState(0);

  const productFetchStatus = useSelector(selectProductFetchStatus);
  const reviewFetchStatus = useSelector(selectReviewFetchStatus);

  //   const maxSteps = products
  const totalReviewRating = reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  const totalReviews = reviews.length;
  const averageRating = parseInt(Math.ceil(totalReviewRating / totalReviews));

  const cartItems = useSelector(selectCartItems);
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const isProductAlreadyInCart = cartItems.some(
    (item) => item.product._id === id
  );

  const wishlistItems = useSelector(selectWishlists);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const isProductAlreadyInWishlist = wishlistItems.some(
    (item) => item.product?._id === id
  );

  const theme = useTheme();
  const is1420 = useMediaQuery(theme.breakpoints.down(1420));
  const is990 = useMediaQuery(theme.breakpoints.down(990));
  const is840 = useMediaQuery(theme.breakpoints.down(840));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const is387 = useMediaQuery(theme.breakpoints.down(387));
  const is340 = useMediaQuery(theme.breakpoints.down(340));

  const handleNextImage = () => {
    setImageStep((prev) => (prev + 1) % product?.images.length);
  };

  const handlePrevImage = () => {
    setImageStep(
      (prev) => (prev - 1 + product?.images.length) % product?.images.length
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    trackMouse: true,
    trackTouch: true,
    preventDefaultTouchmoveEvent: true,
  });

  const handleAddToCart = () => {
    const item = { user: loggedInUser?._id, product: id, quantity };
    dispatch(addToCartAsync(item));
    setQuantity(1);
  };

  const handleDecreaseQty = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (quantity < 20 && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddRemoveFromWishlist = (e) => {
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: id };
      dispatch(createWishlistItemAsync(data));
    } else if (!e.target.checked) {
      const index = wishlistItems.findIndex((item) => item.product._id === id);
      dispatch(
        deleteWishlistItemByIdAsync({
          _id: wishlistItems[index]._id,
          userId: loggedInUser?._id,
        })
      );
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
      dispatch(fetchReviewsByProductIdAsync({ id }));
    }
  }, [id]);

  useEffect(() => {
    if (cartItemAddStatus === "fulfilled") {
      toast.success("Product added to cart");
    } else if (cartItemAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later");
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (wishlistItemAddStatus === "fulfilled") {
      toast.success("Product added to wishlist");
    } else if (wishlistItemAddStatus === "rejected") {
      toast.error("Error adding product to wishlist, please try again later");
    }
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === "fulfilled") {
      toast.success("Product removed from wishlist");
    } else if (wishlistItemDeleteStatus === "rejected") {
      toast.error(
        "Error removing product from wishlist, please try again later"
      );
    }
  }, [wishlistItemDeleteStatus]);

  useEffect(() => {
    if (productFetchStatus === "rejected") {
      toast.error("Error fetching product details, please try again later ");
    }
  }, [productFetchStatus]);

  useEffect(() => {
    if (reviewFetchStatus === "rejected") {
      {
        toast.error("Error fetching product reviews, please try again later ");
      }
    }
  }, [reviewFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductFetchStatus());
      dispatch(resetReviewFetchStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, []);

  return (
    <>
      {!(
        productFetchStatus === "rejected" && reviewFetchStatus === "rejected"
      ) && (
        <Stack
          width={"100%"}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            mb: "2rem",
            rowGap: "2rem",
            // border: "1px solid",
          }}
        >
          {(productFetchStatus || reviewFetchStatus) === "pending" ? (
            <Stack
              width={is500 ? "35vh" : "25rem"}
              height={"calc(100vh - 4rem)"}
              justifyContent={"center"}
              alignContent={"center"}
            >
              <Lottie animationData={loadingAnimation} />
            </Stack>
          ) : (
            <Stack>
              {/* product Details */}
              <Stack
                width={is480 ? "auto" : is1420 ? "auto" : "88rem"}
                p={is840 ? 2 : 0}
                height={is840 ? "auto" : "50rem"}
                rowGap={5}
                mt={is840 ? 0 : 5}
                justifyContent={"center"}
                mb={5}
                flexDirection={is840 ? "column" : "row"}
                columnGap={is990 ? "2rem" : "5rem"}
              >
                {/* left stack images */}
                <Stack
                  sx={{
                    flexDirection: "row",
                    columnGap: "2.5rem",
                    alignSelf: "center",
                    // alignSelf:"flex-start",
                    height: "100%",
                  }}
                >
                  {/* image selection */}

                  {!is1420 && (
                    <Stack
                      sx={{
                        display: "flex",
                        rowGap: "1.5rem",
                        height: "100%",
                        overflowY: "scroll",
                      }}
                    >
                      {product &&
                        product.images.map((image, index) => (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 1 }}
                            style={{ width: "200px", cursor: "pointer" }}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img
                              style={{ width: "100%", objectFit: "contain" }}
                              src={image}
                              alt={`${product.title} image`}
                            />
                          </motion.div>
                        ))}
                    </Stack>
                  )}

                  {/* selected image */}
                  <Stack mt={is480 ? "0rem" : "5rem"}>
                    {is1420 ? (
                      <Stack width={is480 ? "100%" : is990 ? "400px" : "500px"}>
                        <div
                          {...handlers}
                          style={{
                            overflow: "hidden",
                            width: "100%",
                            height: is480 ? "250px" : "420px",
                            margin: "auto",
                            position: "relative",
                            borderRadius: "10px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            touchAction: "pan-y",
                          }}
                        >
                          {product?.images.map((image, index) => (
                            <div
                              key={index}
                              style={{ width: "100%", height: "100%" }}
                            >
                              {/* <Box
                                component="img"
                                sx={{
                                  width: "100%",
                                  objectFit: "contain",
                                  overflow: "hidden",
                                  aspectRatio: 1 / 1,
                                }}
                                src={product.images[index]}
                                alt={product?.title}
                              /> */}

                              <Box
                                sx={{
                                  width: "100%",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={product.images[index]}
                                  alt={product?.title}
                                  style={{
                                    width: "100%",
                                    objectFit: "contain",
                                    overflow: "hidden",
                                    aspectRatio: 1 / 1,
                                  }}
                                />
                              </Box>
                            </div>
                          ))}
                        </div>

                        <MobileStepper
                          steps={product?.images.length}
                          position="static"
                          activeStep={imageStep}
                          nextButton={
                            <Button
                              size="small"
                              onClick={handleNextImage}
                              disabled={
                                imageStep === product?.images.length - 1
                              }
                            >
                              Next{" "}
                              {theme.direction === "rtl" ? (
                                <KeyboardArrowLeft />
                              ) : (
                                <KeyboardArrowRight />
                              )}
                            </Button>
                          }
                          backButton={
                            <Button
                              size="small"
                              onClick={handlePrevImage}
                              disabled={imageStep === 0}
                            >
                              {theme.direction === "rtl" ? (
                                <KeyboardArrowRight />
                              ) : (
                                <KeyboardArrowLeft />
                              )}{" "}
                              Back
                            </Button>
                          }
                        />
                      </Stack>
                    ) : (
                      <div style={{ width: "100%" }}>
                        <img
                          src={product?.images[selectedImageIndex]}
                          alt={`${product?.title} image`}
                          style={{
                            width: "500px",
                            objectFit: "contain",
                            aspectRatio: 1 / 1,
                          }}
                        />
                      </div>
                    )}
                  </Stack>
                </Stack>

                {/* right stack - about product */}
                <Stack rowGap={"1.5rem"} width={is480 ? "100%" : "25rem"}>
                  {/* title rating price */}
                  <Stack rowGap={".5rem"}>
                    {/* title */}
                    <Typography variant="h4" fontWeight={600}>
                      {product?.title}
                    </Typography>

                    {/* rating */}
                    <Stack
                      sx={{
                        flexDirection: "row",
                        columnGap: is340 ? ".5rem" : "1rem",
                        alignItems: " center",
                        flexWrap: "wrap",
                        rowGap: "1rem",
                      }}
                    >
                      <Rating value={averageRating} readOnly />
                      <Typography>
                        (
                        {totalReviews === 0
                          ? "No reviews"
                          : totalReviews === 1
                          ? `${totalReviews} Review`
                          : `${totalReviews} Reviews`}
                        )
                      </Typography>
                      <Typography
                        color={
                          product?.stockQuantity <= 10
                            ? "error"
                            : product?.stockQuantity <= 20
                            ? "orange"
                            : "green"
                        }
                      >
                        {product?.stockQuantity <= 10
                          ? `Only ${product?.stockQuantity} left`
                          : product?.stockQuantity <= 20
                          ? "only few left"
                          : "In Stock"}
                      </Typography>
                    </Stack>

                    {/* price */}
                    <Typography variant="h5">₦{product?.price}</Typography>
                  </Stack>

                  {/* description */}
                  <Stack rowGap={".8rem"}>
                    <Typography>{product?.description}</Typography>
                    <hr />
                  </Stack>

                  {/* color, size and add-to-cart */}

                  {!loggedInUser?.isAdmin && (
                    <Stack sx={{ rowGap: "2rem" }} width={"fit-content"}>
                      {/* colors */}
                      <Stack
                        flexDirection={"row"}
                        alignItems={"center"}
                        columnGap={is387 ? "5px" : "1rem"}
                        width={"fit-content"}
                      >
                        <Typography>Colors:</Typography>
                        <Stack
                          flexDirection={"row"}
                          columnGap={is387 ? ".5rem" : ".2rem"}
                        >
                          {COLORS.map((color, index) => (
                            <div
                              key={color}
                              style={{
                                backgroundColor: "white",
                                border:
                                  selectedColorIndex === index
                                    ? `1px solid ${theme.palette.primary.dark}`
                                    : "",
                                width: is340 ? "40px" : "50px",
                                height: is340 ? "40px" : "50px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "100%",
                              }}
                            >
                              <div
                                onClick={() => setSelectedColorIndex(index)}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  border:
                                    color === "#F6F6F6"
                                      ? "1px solid grayText"
                                      : "",
                                  backgroundColor: color,
                                  borderRadius: "100%",
                                }}
                              ></div>
                            </div>
                          ))}
                        </Stack>
                      </Stack>

                      {/* size */}
                      <Stack
                        flexDirection={"row"}
                        alignItems={"center"}
                        columnGap={is387 ? "5px" : "1rem"}
                        width={"fit-content"}
                      >
                        <Typography>Size: </Typography>
                        <Stack
                          flexDirection={"row"}
                          columnGap={is387 ? ".5rem" : "1rem"}
                        >
                          {SIZES.map((size) => (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 1 }}
                              onClick={() => handleSizeSelect(size)}
                              style={{
                                border:
                                  selectedSize === size
                                    ? ""
                                    : " 1px solid grayText",
                                borderRadius: "8px",
                                width: "15px",
                                height: "15px",
                                // width: is840 ? "25px" : "15px",
                                // height: is840 ? "25px" : "15px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: "1.2rem",
                                backgroundColor:
                                  selectedSize === size
                                    ? "#DB4444"
                                    : "whitesmoke",
                                color: selectedSize === size ? "white" : "",
                              }}
                            >
                              <p>{size}</p>
                            </motion.div>
                          ))}
                        </Stack>
                      </Stack>

                      {/* quantity , add to cart and wishlist */}
                      <Stack
                        flexDirection={"row"}
                        columnGap={is387 ? ".3rem" : "1.5rem"}
                        width={"100%"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        {/* quantity */}
                        {!isProductAlreadyInCart && (
                          <Stack
                            flexDirection={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <MotionConfig
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 1 }}
                            >
                              <motion.button
                                onClick={handleDecreaseQty}
                                style={{
                                  padding: "10px 15px",
                                  fontSize: "1.050rem",
                                  backgroundColor: "",
                                  color: "black",
                                  outline: "none",
                                  border: "1px solid black",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                }}
                              >
                                -
                              </motion.button>
                              <p
                                style={{
                                  margin: "0 1rem",
                                  fontSize: "1.1rem",
                                  fontWeight: "400",
                                }}
                              >
                                {quantity}
                              </p>
                              <motion.button
                                onClick={handleIncreaseQty}
                                style={{
                                  padding: "10px 15px",
                                  fontSize: "1.050rem",
                                  backgroundColor: "black",
                                  color: "white",
                                  outline: "none",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                }}
                              >
                                +
                              </motion.button>
                            </MotionConfig>
                          </Stack>
                        )}

                        {/* add to cart  */}
                        {isProductAlreadyInCart ? (
                          <button
                            style={{
                              padding: "10px 15px",
                              fontSize: "1.050rem",
                              backgroundColor: "transparent",
                              color: "black",
                              //   outline: "none",
                              border: ".5px solid",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                            variant="outlined"
                            onClick={() => navigate("/cart")}
                          >
                            In Cart
                          </button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1 }}
                            onClick={handleAddToCart}
                            style={{
                              padding: "10px 15px",
                              fontSize: "1.050rem",
                              backgroundColor: "black",
                              color: "white",
                              outline: "none",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                          >
                            Add To Cart
                          </motion.button>
                        )}

                        {/* wishlist */}
                        <motion.div
                          style={{
                            border: "1px solid grayText",
                            borderRadius: "4px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Checkbox
                            checked={isProductAlreadyInWishlist}
                            onChange={(e) => handleAddRemoveFromWishlist(e)}
                            icon={<FavoriteBorder />}
                            checkedIcon={<FavoriteIcon sx={{ color: "red" }} />}
                          />
                        </motion.div>
                      </Stack>
                    </Stack>
                  )}

                  {/* product perks */}
                  <Stack
                    mt={3}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px grayText solid",
                      borderRadius: "7px",
                    }}
                  >
                    <Stack
                      p={2}
                      flexDirection={"row"}
                      alignItems={"center"}
                      columnGap={"1rem"}
                      width={"100%"}
                      justifyContent={"flex-start"}
                    >
                      <Box sx={{ padding: "0 0px 0 15px" }}>
                        <LocalShippingOutlined />
                      </Box>
                      <Stack>
                        <Typography>Free Delivery</Typography>
                        <Typography>
                          Enter your postal for delivery availability
                        </Typography>
                      </Stack>
                    </Stack>
                    <hr style={{ width: "100%" }} />
                    <Stack
                      p={2}
                      flexDirection={"row"}
                      alignItems={"center"}
                      justifyContent={"flex-start"}
                      width={"100%"}
                      columnGap={"1rem"}
                    >
                      <Box sx={{ padding: "0 0px 0 15px" }}>
                        <CachedOutlined />
                      </Box>
                      <Stack>
                        <Typography>Return Delivery</Typography>
                        <Typography>Free 30 Days Delivery Returns</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              {/* reviews */}
              <Stack width={is1420 ? "auto" : "88rem"} p={is480 ? 2 : 0}>
                <Reviews productId={id} averageRating={averageRating} />
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
};
