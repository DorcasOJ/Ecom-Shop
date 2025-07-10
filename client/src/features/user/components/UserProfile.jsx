import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddressAsync,
  resetAddressAddStatus,
  resetAddressDeleteStatus,
  resetAddressUpdateStatus,
  selectAddressAddStatus,
  selectAddressDeleteStatus,
  selectAddresses,
  selectAddressStatus,
  selectAddressUpdateStatus,
} from "../../address/AddressSlice";
import { selectUserInfo } from "../UserSlice";
import { useTheme } from "@emotion/react";
import {
  Avatar,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";
import { Address } from "../../address/components/Address";

const UserProfile = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [addAddress, setAddAddress] = useState(false);

  const addressStatus = useSelector(selectAddressStatus);
  const addressAddStatus = useSelector(selectAddressAddStatus);
  const addressUpdateStatus = useSelector(selectAddressUpdateStatus);
  const addressDeleteStatus = useSelector(selectAddressDeleteStatus);
  const addresses = useSelector(selectAddresses);

  const userInfo = useSelector(selectUserInfo);

  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const handleAddAddress = (data) => {
    const address = { ...data, user: userInfo?._id };
    dispatch(addAddressAsync(address));
    setAddAddress(false);
    reset();
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (addressAddStatus == "fulfilled") {
      toast.success("Address added");
    } else if (addressAddStatus == "rejected") {
      toast.error("Error adding address, please try again later");
    }
  }, [addressAddStatus]);

  useEffect(() => {
    if (addressUpdateStatus == "fulfilled") {
      toast.success("Address updated");
    } else if (addressUpdateStatus == "rejected") {
      toast.error("Error updating address, please try again later");
    }
  }, [addressUpdateStatus]);

  useEffect(() => {
    if (addressDeleteStatus == "fulfilled") {
      toast.success("Address deleted");
    } else if (addressDeleteStatus == "rejected") {
      toast.error("Error deleting address, please try again later");
    }
  }, [addressDeleteStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetAddressAddStatus());
      dispatch(resetAddressUpdateStatus());
      dispatch(resetAddressDeleteStatus());
    };
  }, []);

  return (
    <Stack
      height={"calc(100vh - 4rem)"}
      justifyContent={"flex-start"}
      alignItems={"center"}
    >
      <Stack
        component={is480 ? "" : Paper}
        elevation={1}
        width={is900 ? "100%" : "50rem"}
        p={2}
        mt={is480 ? 0 : 5}
        rowGap={2}
      >
        {/* user details - name, email */}
        <Stack
          bgcolor={theme.palette.primary.light}
          color={theme.palette.primary.main}
          p={2}
          rowGap={1}
          borderRadius={".6rem"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Avatar alt={userInfo?.name} sx={{ width: 70, height: 70 }} />
          <Typography>{userInfo?.name}</Typography>
          <Typography>{userInfo?.email}</Typography>
        </Stack>

        {/* address section */}
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          rowGap={3}
          width={is900 ? "80%" : "50%"}
          mx={"auto"}
        >
          {/* heading and add button */}
          <Stack flexDirection={"row"} alignItems={"center"} columnGap={1}>
            <Typography variant="h6" fontWeight={400}>
              Manage addresses
            </Typography>
            <Button
              onClick={() => setAddAddress(true)}
              size={is480 ? "small" : ""}
              variant="contained"
            >
              Add
            </Button>
          </Stack>

          {/* add address form  */}
          {addAddress ? (
            <Stack
              component={"form"}
              width={"100%"}
              noValidate
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
                <Typography gutterBottom>Phone Number</Typography>
                <TextField
                  type="number"
                  {...register("phoneNumber", { required: true })}
                />
              </Stack>

              <Stack>
                <Typography gutterBottom>Street</Typography>
                <TextField {...register("street", { required: true })} />
              </Stack>

              <Stack width={"100%"}>
                <Typography type="number" gutterBottom>
                  Postal Code
                </Typography>
                <TextField
                  type="number"
                  {...register("postalCode", { required: true })}
                />
              </Stack>

              <Stack width={"100%"}>
                <Typography gutterBottom>City</Typography>
                <TextField {...register("city", { required: true })} />
              </Stack>

              <Stack width={"100%"}>
                <Typography gutterBottom>State</Typography>
                <TextField {...register("state", { required: true })} />
              </Stack>

              <Stack>
                <Typography gutterBottom>Country</Typography>
                <TextField {...register("country", { required: true })} />
              </Stack>

              <Stack
                flexDirection={"row"}
                alignSelf={"flex-end"}
                columnGap={is480 ? 1 : 2}
                mt={2}
              >
                <Button
                  loading={addressStatus === "pending"}
                  type="submit"
                  size={is480 ? "small" : ""}
                  variant="contained"
                >
                  add
                </Button>

                <Button
                  color="error"
                  variant={is480 ? "outlined" : "text"}
                  size={is480 ? "small" : ""}
                  onClick={() => setAddAddress(false)}
                >
                  cancel
                </Button>
              </Stack>
            </Stack>
          ) : (
            ""
          )}

          {/* mapping on addresses here */}
          <Stack width={"100%"} rowGap={2}>
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <Address
                  key={address._id}
                  id={address._id}
                  type={address.type}
                  postalCode={address.postalCode}
                  street={address.street}
                  phoneNumber={address.phoneNumber}
                  city={address.city}
                  state={address.state}
                  country={address.country}
                />
              ))
            ) : (
              <Typography textAlign={"center"} mt={2} variant="body2">
                You have no added addresses
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UserProfile;
