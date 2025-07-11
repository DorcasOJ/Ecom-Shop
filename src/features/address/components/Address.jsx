import {
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAddressByIdAsync,
  selectAddressErrors,
  selectAddressStatus,
  updateAddressByIdAsync,
} from "../AddressSlice";
import { useState } from "react";
import { selectLoggedInUser } from "../../auth/AuthSlice";

export const Address = ({
  id,
  type,
  postalCode,
  street,
  phoneNumber,
  city,
  state,
  country,
}) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const loggedInUser = useSelector(selectLoggedInUser);
  const status = useSelector(selectAddressStatus);
  const error = useSelector(selectAddressErrors);

  const [edit, setEdit] = useState(false);
  //   const [open, setOpen] = useState(false);

  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const handleRemoveAddress = () => {
    dispatch(deleteAddressByIdAsync({ _id: id, user: loggedInUser?._id }));
  };

  const handleUpdateAddress = (data) => {
    const update = { ...data, _id: id, user: loggedInUser?._id };
    setEdit(false);
    dispatch(updateAddressByIdAsync(update));
  };

  return (
    <Stack width={"100%"} p={is480 ? 0 : 1}>
      {/* address type */}
      <Stack
        color={"whitesmoke"}
        p={".5rem"}
        borderRadius={".2rem"}
        bgcolor={theme.palette.primary.main}
      >
        <Typography>{type?.toUpperCase()}</Typography>
      </Stack>

      {/* address details */}
      <Stack p={2} position={"relative"} flexDirection={"column"} rowGap={1}>
        {edit ? (
          <Stack
            rowGap={2}
            component={"form"}
            noValidate
            onSubmit={handleSubmit(handleUpdateAddress)}
            position={"relative"}
          >
            <Stack>
              <Typography gutterBottom>Type</Typography>
              <TextField
                placeholder="Eg. Home, Business"
                {...register("type", { required: true, value: type })}
              />
            </Stack>

            <Stack>
              <Typography gutterBottom>Phone Number</Typography>
              <TextField
                {...register("phoneNumber", {
                  required: true,
                  value: phoneNumber,
                })}
              />
            </Stack>

            <Stack>
              <Typography gutterBottom>Street</Typography>
              <TextField
                {...register("street", { required: true, value: street })}
              />
            </Stack>

            <Stack width={"100%"}>
              <Typography gutterBottom>City</Typography>
              <TextField
                {...register("city", { required: true, value: city })}
              />
            </Stack>

            <Stack width={"100%"}>
              <Typography type="number" gutterBottom>
                Postal Code
              </Typography>
              <TextField
                {...register("postalCode", {
                  required: true,
                  value: postalCode,
                })}
              />
            </Stack>

            <Stack width={"100%"}>
              <Typography gutterBottom>State</Typography>
              <TextField
                {...register("state", { required: true, value: state })}
              />
            </Stack>

            <Stack>
              <Typography gutterBottom>Country</Typography>
              <TextField
                {...register("country", { required: true, value: country })}
              />
            </Stack>

            <Stack
              flexDirection={"row"}
              alignSelf={"flex-end"}
              columnGap={1}
              position={is480 ? "static" : edit ? "static" : "absolute"}
              bottom={4}
              right={4}
              mt={is480 ? 2 : 4}
            >
              <Button
                loading={status === "pending"}
                size="small"
                type="submit"
                variant="contained"
                width={"fit"}
              >
                Save
              </Button>

              <Button
                size="small"
                onClick={() => {
                  setEdit(false);
                  reset();
                }}
                color="error"
                variant="outlined"
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : (
          <>
            <Typography>Phone Number - {phoneNumber}</Typography>
            <Typography>Street - {street}</Typography>
            <Typography>City - {city}</Typography>

            <Typography>State - {state}</Typography>
            <Typography>Postal Code - {postalCode}</Typography>

            <Typography>Country - {country}</Typography>
          </>
        )}

        {/* buttons */}
        <Stack
          flexDirection={"row"}
          alignSelf={"flex-end"}
          columnGap={1}
          position={is480 ? "static" : edit ? "static" : "absolute"}
          bottom={4}
          right={4}
          mt={is480 ? 2 : 4}
        >
          {!edit && (
            <Button size="small" onClick={() => setEdit(true)}>
              Edit
            </Button>
          )}

          {!edit && (
            <Button
              variant="outlined"
              color="error"
              loading={status === "pending"}
              size="small"
              onClick={handleRemoveAddress}
            >
              Remove
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
