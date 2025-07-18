import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import {
  addToCartAsync,
  resetCartItemAddStatus,
  selectCartItems,
} from "../../cart/CartSlice";
import { useTheme } from "@emotion/react";
import {
  Checkbox,
  duration,
  FormHelperText,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { selectWishlists } from "../../wishlist/WishlistSlice";
import { FavoriteBorder } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import { useEffect } from "react";

export const ProductCard = ({
  id,
  title,
  price,
  thumbnail,
  brand,
  stockQuantity,
  handleAddRemoveFromWishlist,
  isWishlistCard,
  isAdminCard,
}) => {
  const navigate = useNavigate();
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishListItems = useSelector(selectWishlists);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  let isProductALreadyInWishlist = -1;

  const theme = useTheme();
  const is1410 = useMediaQuery(theme.breakpoints.down(1410));
  const is932 = useMediaQuery(theme.breakpoints.down(932));
  const is752 = useMediaQuery(theme.breakpoints.down(752));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is608 = useMediaQuery(theme.breakpoints.down(608));
  const is488 = useMediaQuery(theme.breakpoints.down(488));
  const is408 = useMediaQuery(theme.breakpoints.down(408));
  isProductALreadyInWishlist = wishListItems.some(
    (item) => item.product?._id === id
  );
  const isProductALreadyInCart = cartItems.some(
    (item) => item.product?._id === id
  );

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    // does not bubble to parent element
    const data = { user: loggedInUser?._id, product: id };
    dispatch(addToCartAsync(data));
  };

  useEffect(() => {
    return () => {
      dispatch(resetCartItemAddStatus());
    };
  });

  return (
    <>
      {isProductALreadyInWishlist !== -1 ? (
        <Stack
          component={
            isAdminCard ? "" : isWishlistCard ? "" : is408 ? "" : Paper
          }
          mt={is408 ? 2 : 0}
          elevation={1}
          p={2}
          width={
            is408
              ? "auto"
              : is488
              ? "200px"
              : is608
              ? "240px"
              : is752
              ? "300px"
              : is932
              ? "240px"
              : is1410
              ? "300px"
              : "340px"
          }
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(`/product-details/${id}`)}
        >
          {/* display image */}
          <Stack>
            <img
              width={"100%"}
              style={{ aspectRatio: 1 / 1, objectFit: "contain" }}
              height={"100%"}
              src={thumbnail}
              alt={`${title} photo unavailable`}
            />
          </Stack>

          {/* lower section */}
          <Stack flex={2} justifyContent={"flex-end"} spacing={1} rowGap={2}>
            <Stack>
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography>{title}</Typography>

                {!isAdminCard && (
                  <motion.div
                    whileHover={{ scale: 1.3, y: -10, zIndex: 100 }}
                    whileTap={{ scale: 1 }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    <Checkbox
                      onClick={(e) => e.stopPropagation()}
                      checked={isProductALreadyInWishlist}
                      onChange={(e) => handleAddRemoveFromWishlist(e, id)}
                      icon={<FavoriteBorder />}
                      checkedIcon={<FavoriteIcon sx={{ color: "red" }} />}
                    />
                  </motion.div>
                )}
              </Stack>
              <Typography color={"text.secondary"}>{brand}</Typography>
            </Stack>

            <Stack
              sx={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>₦{Number(price).toLocaleString()}</Typography>

              {!isWishlistCard ? (
                isProductALreadyInCart ? (
                  <p>Added to Cart</p>
                ) : (
                  !isAdminCard && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 1 }}
                      onClick={(e) => handleAddToCart(e)}
                      style={{
                        padding: "3px 15px",
                        borderRadius: "3px",
                        outline: "none",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: "black",
                        color: "white",
                        fontSize: is408
                          ? ".9rem"
                          : is488
                          ? ".7rem"
                          : is500
                          ? ".8rem"
                          : ".9rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          columnGap: ".5rem",
                        }}
                      >
                        <p>Add to Cart</p>
                      </div>
                    </motion.button>
                  )
                )
              ) : (
                ""
              )}
            </Stack>

            {stockQuantity <= 20 && (
              <FormHelperText sx={{ fontSize: ".9rem" }} error>
                {stockQuantity === 1
                  ? "Only 1 stock is left"
                  : "Only few are left"}
              </FormHelperText>
            )}
          </Stack>
        </Stack>
      ) : (
        ""
      )}
    </>
  );
};
