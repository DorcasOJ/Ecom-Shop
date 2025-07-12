import {
  Button,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCartItemRemoveStatus,
  selectCartItemRemoveStatus,
  selectCartItems,
} from "../CartSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartItem } from "./CartItem";
import { SHIPPING, TAXES } from "../../../constants";
import { motion } from "framer-motion";

export const Cart = ({ checkout }) => {
  const items = useSelector(selectCartItems);
  const cartItemRemoveStatus = useSelector(selectCartItemRemoveStatus);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subTotal = items.reduce(
    (acc, item) => item.product.price * item.quantity + acc,
    0
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items]);

  useEffect(() => {
    if (cartItemRemoveStatus === "fulfilled") {
      toast.success("Product removed from cart");
    } else if (cartItemRemoveStatus === "rejected") {
      toast.error("Error removing product from cart, please try again later");
    }
  }, [cartItemRemoveStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetCartItemRemoveStatus());
    };
  });
  return (
    <Stack justifyContent={"flex-start"} alignItems={"center"} mb={"5rem"}>
      <Stack
        width={is900 ? "auto" : "50rem"}
        mt={"3rem"}
        paddingLeft={checkout ? 0 : 2}
        paddingRight={checkout ? 0 : 2}
        rowGap={4}
      >
        {/* cart items */}
        <Stack rowGap={2}>
          {items &&
            items.map((item) => (
              <CartItem
                key={item._id}
                id={item._id}
                thumbnail={item.product.thumbnail}
                title={item.product.title}
                category={item.product.category.name}
                brand={item.product.brand.name}
                price={item.product.price}
                quantity={item.quantity}
                stockQuantity={item.product.stockQuantity}
                productId={item.product._id}
                checkout={checkout}
              />
            ))}
        </Stack>

        {/* subtotal */}
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {checkout ? (
            <Stack rowGap={2} width={"100%"}>
              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Typography>Subtotal</Typography>
                <Typography>₦{subTotal}</Typography>
              </Stack>

              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Typography>Shipping</Typography>
                <Typography>₦{SHIPPING}</Typography>
              </Stack>

              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Typography>Taxes</Typography>
                <Typography>₦{TAXES}</Typography>
              </Stack>

              <div style={{ borderBottom: ".5px solid #ccc" }}></div>

              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Typography>Total</Typography>
                <Typography>
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(subTotal + SHIPPING + TAXES)}
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <>
              <Stack>
                <Typography variant="h6" fontWeight={500}>
                  Subtotal
                </Typography>
                <Typography>Total items in cart</Typography>
                <Typography variant="body1" color={"text.secondary"}>
                  Shipping and taxes will be calculated at checkbox.
                </Typography>
              </Stack>

              <Stack>
                <Typography variant="h6" fontWeight={500}>
                  ₦{subTotal}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>

        {/* checkout or continue shopping */}
        {!checkout && (
          <Stack rowGap={"1rem"}>
            <Button variant="contained" component={Link} to={"/checkout"}>
              Checkout
            </Button>
            <motion.div style={{ alignSelf: "center" }} whileHover={{ y: 2 }}>
              <Button
                sx={{ cursor: "pointer", borderRadius: "8px" }}
                component={Link}
                to={"/"}
                variant="outlined"
              >
                or continue shopping
              </Button>
            </motion.div>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
