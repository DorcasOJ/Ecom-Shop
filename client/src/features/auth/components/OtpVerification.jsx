import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  clearOtpVerificationError,
  clearResendOtpError,
  clearResendOtpSuccessMessage,
  resendOtpAsync,
  resetOtpVerificationStatus,
  selectLoggedInUser,
  selectOtpVerificationError,
  selectOtpVerificationStatus,
  selectResendOtpError,
  selectResendOtpStatus,
  selectResendOtpSuccessMessage,
  verifyOtpAsync,
} from "../AuthSlice";
import { toast } from "react-toastify";
import {
  Button,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

export const OtpVerification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const resendOtpStatus = useSelector(selectResendOtpStatus);
  const resendOtpError = useSelector(selectResendOtpError);
  const resendOtpSuccessMessage = useSelector(selectResendOtpSuccessMessage);
  const otpVerificationStatus = useSelector(selectOtpVerificationStatus);
  const otpVerificationError = useSelector(selectOtpVerificationError);

  //   handles the redirection
  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login");
    } else if (loggedInUser && loggedInUser?.isVerified) {
      navigate("/");
    }
  }, [loggedInUser]);

  const handleSendOtp = () => {
    const data = { userId: loggedInUser?._id };
    // console.log(data);
    dispatch(resendOtpAsync(data));
  };

  const handleVerifyOtp = (data) => {
    const cred = { ...data, userId: loggedInUser?._id };
    // console.log(cred);
    dispatch(verifyOtpAsync(cred));
  };

  useEffect(() => {
    if (resendOtpError) {
      toast.error(resendOtpError.message);
    }
    return () => {
      dispatch(clearResendOtpError());
    };
  }, [resendOtpError]);

  useEffect(() => {
    if (resendOtpSuccessMessage) {
      toast.success(resendOtpSuccessMessage.message);
    }
    return () => {
      dispatch(clearResendOtpSuccessMessage());
    };
  }, [resendOtpSuccessMessage]);

  useEffect(() => {
    if (otpVerificationError) {
      toast.success(otpVerificationError.message);
    }
    return () => {
      dispatch(clearOtpVerificationError());
    };
  }, [otpVerificationError]);

  useEffect(() => {
    if (otpVerificationStatus) {
      toast.success(otpVerificationStatus.message);
    }
    return () => {
      dispatch(resetOtpVerificationStatus());
    };
  }, [otpVerificationStatus]);

  return (
    <Stack
      width={"100%"}
      height={"100vh"}
      noValidate
      flexDirection={"column"}
      rowGap={3}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack
        component={Paper}
        elevation={1}
        position={"relative"}
        justifyContent={"center"}
        alignItems={"center"}
        p={"2rem"}
        rowGap={"2rem"}
      >
        <Typography mt={4} variant="h5" fontWeight={500}>
          Verify Your Email Address
        </Typography>

        {resendOtpStatus === "fulfilled" ? (
          <Stack
            width={"100%"}
            rowGap={"1rem"}
            component={"form"}
            noValidate
            onSubmit={handleSubmit(handleVerifyOtp)}
          >
            <Stack rowGap={"1rem"}>
              <Stack>
                <Typography color={"GreyText"}>
                  {" "}
                  Enter the 4 digit OTP sent on
                </Typography>
                <Typography fontWeight={"600"} color={"GrayText"}>
                  {loggedInUser?.email}
                </Typography>
              </Stack>
              <Stack>
                <TextField
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: {
                      value: 4,
                      message: "Please enter a 4 digit OTP",
                    },
                  })}
                  fullWidth
                  type="number"
                />
                {errors?.otp && (
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.otp.message}
                  </FormHelperText>
                )}
              </Stack>
              <Button
                loading={otpVerificationStatus == "pending"}
                type="submit"
                fullWidth
                variant="contained"
              >
                Verify
              </Button>
            </Stack>
          </Stack>
        ) : (
          <>
            <Stack>
              <Typography color={"GrayText"}>
                We will send you an OTP on
              </Typography>
              <Typography fontWeight={"600"} color={"GrayText"}>
                {loggedInUser?.email}
              </Typography>
            </Stack>
            <Button
              onClick={handleSendOtp}
              loading={resendOtpStatus == "pending"}
              fullWidth
              variant="contained"
            >
              Get OTP
            </Button>
          </>
        )}
      </Stack>

      <Stack>
        <Typography
          sx={{ textDecoration: "none", color: "text.primary" }}
          to={"/signup"}
          component={Link}
        >
          Token Expired?,{" "}
          <span style={{ cursor: "pointer" }}>Back to Login</span>
        </Typography>
      </Stack>
    </Stack>
  );
};
