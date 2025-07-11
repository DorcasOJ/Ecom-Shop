import { useDispatch, useSelector } from "react-redux";
import {
  addAddressAsync,
  fetchAddressByUserIdAsync,
  selectAddressAddStatus,
  selectAddresses,
  selectAddressStatus,
} from "../../address/AddressSlice";
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Paper,
  Radio,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { ArrowBack } from "@mui/icons-material";
import theme from "../../../theme/theme";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { toast } from "react-toastify";
import {
  createOrderAsync,
  selectOrderCurrentOrder,
  selectOrders,
  selectOrderStatus,
} from "../../order/OrderSlice";
import { Cart } from "../../cart/components/Cart";
import {
  getCartByUserIdAsync,
  resetCartByUserIdAsync,
  selectCartItems,
} from "../../cart/CartSlice";
import { SHIPPING, TAXES } from "../../../constants";

export const Checkout = () => {
  const status = "";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addresses = useSelector(selectAddresses);
  const loggedInUser = useSelector(selectLoggedInUser);
  const addressAddStatus = useSelector(selectAddressAddStatus);
  //   const orderStatus = useSelector(selectOrderStatus);
  const cartItems = useSelector(selectCartItems);
  const currentOrder = useSelector(selectOrderCurrentOrder);
  const orderTotal = cartItems.reduce(
    (acc, item) => item.product.price * item.quantity + acc,
    0
  );

  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  const [disableCheckoutButton, setDisableCheckoutButton] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));
  const is900 = useMediaQuery(theme.breakpoints.down(900));

  const orders = useSelector(selectOrders);

  const handleAddAddress = (data) => {
    const address = { ...data, user: loggedInUser._id };
    dispatch(addAddressAsync(address));
  };

  const handleCreateOrder = () => {
    const order = {
      user: loggedInUser._id,
      item: cartItems,
      address: selectedAddress,
      paymentMode: selectedPaymentMethod,
      total: orderTotal + SHIPPING + TAXES,
    };
    dispatch(createOrderAsync(order));
    setDisableCheckoutButton(true);
  };

  useEffect(() => {
    dispatch(fetchAddressByUserIdAsync(loggedInUser?._id));
  }, []);

  useEffect(() => {
    if (currentOrder && currentOrder._id) {
      dispatch(resetCartByUserIdAsync(loggedInUser?._id));
      dispatch(getCartByUserIdAsync(loggedInUser?._id));
      navigate(`/order-success/${currentOrder?._id}`);
    }
  }, [currentOrder]);

  useEffect(() => {
    if (addressAddStatus === "fulfilled") {
      toast.success("Successful! Kindly select address before checking out");
      reset();
    } else if (addressAddStatus === "rejected") {
      toast.error("Error adding your address");
    }
  }, [addressAddStatus]);

  return (
    <Stack
      flexDirection={"row"}
      p={2}
      rowGap={10}
      justifyContent={"center"}
      flexWrap={"wrap"}
      mb={"5rem"}
      mt={2}
      columnGap={7}
      alignItems={"flex-start"}
    >
      {/* left box */}
      <Stack rowGap={4} width={is900 ? "100%" : "auto"}>
        {/* heading */}
        <Stack
          flexDirection={"row"}
          columnGap={is480 ? 0.3 : 1}
          alignItems={"center"}
        >
          <motion.div whileHover={{ x: -5 }}>
            <IconButton component={Link} to={"/cart"}>
              <ArrowBack fontSize={is480 ? "medium" : "large"} />
            </IconButton>
          </motion.div>
          <Typography variant="h4">Shipping Information</Typography>
        </Stack>

        {/* address form */}
        <Stack
          component={"form"}
          noValidate
          rowGap={2}
          onSubmit={handleSubmit(handleAddAddress)}
        >
          <Stack>
            <Typography gutterBottom>Type</Typography>
            <TextField
              placeholder="Eg. Home, Business"
              {...register("type", { required: true })}
            />
          </Stack>

          <Stack>
            <Typography gutterBottom>Street</Typography>
            <TextField {...register("street", { required: true })} />
          </Stack>

          <Stack>
            <Typography gutterBottom>Country</Typography>
            <TextField {...register("country", { required: true })} />
          </Stack>

          <Stack>
            <Typography gutterBottom>Phone Number</Typography>
            <TextField {...register("phoneNumber", { required: true })} />
          </Stack>

          <Stack flexDirection={"row"}>
            <Stack width={"100%"}>
              <Typography gutterBottom>City</Typography>
              <TextField {...register("city", { required: true })} />
            </Stack>

            <Stack width={"100%"}>
              <Typography gutterBottom>State</Typography>
              <TextField {...register("state", { required: true })} />
            </Stack>
            <Stack width={"100%"}>
              <Typography type="number" gutterBottom>
                Postal Code
              </Typography>
              <TextField {...register("postalCode", { required: true })} />
            </Stack>
          </Stack>

          <Stack flexDirection={"row"} alignSelf={"flex-end"} columnGap={1}>
            <Button
              loading={status === "pending"}
              type="submit"
              variant="contained"
            >
              add
            </Button>

            <Button onClick={() => reset()} color="error" variant="outlined">
              Reset
            </Button>
          </Stack>
        </Stack>

        {/* existing address */}
        <Stack rowGap={3}>
          <Stack>
            <Typography>Address</Typography>
            <Typography variant="body2" color={"text.secondary"}>
              Choose from existing Addresses
            </Typography>
          </Stack>

          <Grid
            container
            gap={2}
            width={is480 ? "auto" : "50rem"}
            justifyContent={"flex-start"}
            alignContent={"flex-start"}
            wrap="wrap"
          >
            {addresses.map((address, index) => (
              <FormControl key={address._id}>
                <Stack
                  key={address._id}
                  p={2}
                  width={is480 ? "100%" : "20rem"}
                  height={is480 ? "auto" : "15rem"}
                  rowGap={2}
                  component={Paper}
                  elevation={1}
                >
                  <Stack flexDirection={"row"} alignItems={"center"}>
                    <Radio
                      checked={selectedAddress === address}
                      name="addressRadioGroup"
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(addresses[index])}
                    />
                    <Typography>{address.type}</Typography>
                  </Stack>

                  {/* details */}
                  <Stack justifyContent={"center"}>
                    <Stack
                      justifyContent={"space-between"}
                      flexDirection={"row"}
                    >
                      <Typography>Street:</Typography>
                      <Typography>{address.street}</Typography>
                    </Stack>
                    <Stack
                      justifyContent={"space-between"}
                      flexDirection={"row"}
                    >
                      <Typography>City</Typography>
                      <Typography>{address.city}</Typography>
                    </Stack>

                    <Stack
                      justifyContent={"space-between"}
                      flexDirection={"row"}
                    >
                      <Typography>State</Typography>
                      <Typography>{address.state}</Typography>
                    </Stack>

                    <Stack
                      justifyContent={"space-between"}
                      flexDirection={"row"}
                    >
                      <Typography>Country</Typography>
                      <Typography>{address.country}</Typography>
                    </Stack>

                    <Stack
                      justifyContent={"space-between"}
                      flexDirection={"row"}
                    >
                      <Typography>PostalCode</Typography>
                      <Typography>{address.postalCode}</Typography>
                    </Stack>

                    <Stack
                      justifyContent={"space-between"}
                      flexDirection={"row"}
                    >
                      <Typography>PhoneNumber</Typography>
                      <Typography>{address.phoneNumber}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </FormControl>
            ))}
          </Grid>
        </Stack>

        {/* payment method */}
        <Stack rowGap={3}>
          <Stack>
            <Typography varian="h6">Payment Methods</Typography>
            <Typography varian="body2">
              Please select a payment method
            </Typography>
          </Stack>
          <Stack rowGap={2}>
            <Stack
              flexDirection={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <Radio
                value={selectedPaymentMethod}
                name="paymentMethod"
                checked={selectedPaymentMethod === "COD"}
                onChange={() => setSelectedPaymentMethod("COD")}
              />
              <Typography>Cash</Typography>
            </Stack>

            <Stack
              flexDirection={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <Radio
                value={selectedPaymentMethod}
                name="paymentMethod"
                checked={selectedPaymentMethod === "CARD"}
                onChange={() => setSelectedPaymentMethod("CARD")}
              />
              <Typography>Card</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* right box */}
      <Stack
        width={is900 ? "100%" : "auto"}
        alignItems={is900 ? "center" : "flex-start"}
      >
        <Typography variant="h4">Order summary</Typography>
        <Cart checkout={true} />
        <Button
          fullWidth
          loading={disableCheckoutButton}
          variant="contained"
          onClick={handleCreateOrder}
          size="large"
          type="submit"
        >
          {selectedPaymentMethod === "COD" ? "Order" : "Pay and Order"}
        </Button>
      </Stack>
    </Stack>
  );
};
