import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  resetCurrentOrder,
  selectOrderCurrentOrder,
} from "../features/order/OrderSlice";
import Lottie from "lottie-react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { orderSuccessAnimation } from "../assets";
import { selectUserInfo } from "../features/user/UserSlice";
import { useEffect } from "react";

export const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectOrderCurrentOrder);
  const userDetails = useSelector(selectUserInfo);
  const { id } = useParams();

  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (!currentOrder) {
      navigate("/");
    }
  }, [currentOrder]);

  return (
    <Stack
      width={"100vw"}
      height={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack
        component={Paper}
        rowGap={3}
        elevation={1}
        p={is480 ? 1 : 4}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box width={"10rem"} height={"7rem"}>
          <Lottie animationData={orderSuccessAnimation}></Lottie>
        </Box>

        <Stack
          mt={2}
          textAlign={"center"}
          justifyContent={"center"}
          alignItems={"center"}
          rowGap={1}
        >
          <Typography variant="h6" fontWeight={400}>
            Hey {userDetails?.name}
          </Typography>
          <Typography variant="h5">
            Your order #{currentOrder?._id} is confirmed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thank you for shopping with us ❤️
          </Typography>
        </Stack>
        <Button component={Link} to={"/orders"} variant="contained">
          Check order status in my orders
        </Button>

        <Button
          component={Link}
          to={"/"}
          onClick={() => dispatch(resetCurrentOrder())}
          size={is480 ? "small" : ""}
          variant="outlined"
        >
          Continue shopping
        </Button>
      </Stack>
    </Stack>
  );
};
