import {
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import { deleteCartItemByIdAsync, updateCartItemByIdAsync } from "../CartSlice";
import AddIcon from "@mui/icons-material/Add";
import { selectLoggedInUser } from "../../auth/AuthSlice";

export const CartItem = ({
  id,
  thumbnail,
  title,
  category,
  brand,
  price,
  quantity,
  stockQuantity,
  productId,
  checkout,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is552 = useMediaQuery(theme.breakpoints.down(552));
  const is480 = useMediaQuery(theme.breakpoints.down(490));
  const loggedInUser = useSelector(selectLoggedInUser);

  const handleRemoveQty = () => {
    if (quantity === 1) {
      dispatch(deleteCartItemByIdAsync({ id, user: loggedInUser._id }));
    } else {
      const update = {
        _id: id,
        quantity: quantity - 1,
        user: loggedInUser._id,
      };
      dispatch(updateCartItemByIdAsync(update));
    }
  };

  const handleProductRemove = () => {
    dispatch(deleteCartItemByIdAsync({ id, user: loggedInUser._id }));
  };

  const handleAddQty = () => {
    const update = { _id: id, quantity: quantity + 1, user: loggedInUser._id };
    dispatch(updateCartItemByIdAsync(update));
  };
  return (
    <Stack
      bgcolor={"white"}
      component={is900 ? "" : Paper}
      p={is900 ? 0 : 2}
      elevation={1}
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      {/* image and details */}
      <Stack
        flexDirection={"row"}
        rowGap={"1rem"}
        alignItems={"center"}
        columnGap={2}
        flexWrap={"wrap"}
      >
        <Stack
          width={is552 ? "auto" : "200px"}
          height={is552 ? "auto" : "200px"}
          component={Link}
          to={`/product-details/${productId}`}
        >
          <img
            src={thumbnail}
            alt={`${title} image unavailable`}
            style={{
              width: "100%",
              height: is552 ? "auto" : "100%",
              aspectRatio: is552 ? 1 / 1 : "",
              objectFit: "contain",
            }}
          />
        </Stack>

        <Stack alignSelf={""}>
          <Typography
            component={Link}
            to={`/product-details/${productId}`}
            sx={{ textDecoration: "none", color: theme.palette.primary.main }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color={"text.secondary"}>
            {brand}
          </Typography>
          <Typography mt={1}>Quantity</Typography>
          <Stack flexDirection={"row"} alignItems={"center"}>
            {!checkout && (
              <IconButton onClick={handleRemoveQty}>
                <RemoveIcon fontSize="small" />
              </IconButton>
            )}

            <Typography>{quantity}</Typography>
            {!checkout && (
              <IconButton onClick={handleAddQty}>
                <AddIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* price and remove button */}
      <Stack
        justifyContent={"space-around"}
        alignSelf={is552 ? "flex-end" : ""}
        height={"100%"}
        rowGap={"1rem"}
        alignItems={"flex-end"}
      >
        <Typography variant="body2">₦{price}</Typography>

        {!checkout && (
          <Button
            size={is480 ? "small" : ""}
            onClick={handleProductRemove}
            variant="contained"
          >
            Remove
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
